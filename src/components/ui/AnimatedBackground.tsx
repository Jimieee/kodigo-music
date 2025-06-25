import { type FC, useEffect, useRef, useState } from 'react';

interface Circle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: [number, number, number];
  interactive: boolean;
}

interface OrganicBackgroundProps {
  colors?: string[];
  isPlaying?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const OrganicBackground: FC<OrganicBackgroundProps> = ({
  colors = ['#ffff', '#ffff', '#ffff', '#ffff', '#ffff', '#ffff'],
  isPlaying = true,
  intensity = 'medium',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const circlesRef = useRef<Circle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const intensityConfig = {
    low: { movingCircles: 3, speedMultiplier: 0.5, radiusMultiplier: 0.15 },
    medium: { movingCircles: 4, speedMultiplier: 1.0, radiusMultiplier: 0.2 },
    high: { movingCircles: 5, speedMultiplier: 2.0, radiusMultiplier: 0.2 },
  };

  const config = intensityConfig[intensity];

  const convertColors = (hexColors: string[]): [number, number, number][] => {
    return hexColors.map(hex => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    });
  };

  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(void) {
      v_uv = a_position * 0.5 + 0.5; 
      v_uv.y = 1.0 - v_uv.y; 
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform int u_circleCount;
    uniform vec3 u_circlesColor[6];
    uniform vec3 u_circlesPosRad[6];
    uniform vec2 u_mouse;
    uniform bool u_isPlaying;
    uniform vec3 u_bgColor;
    
    void main(void) {
      vec2 st = v_uv * u_resolution;
      
      vec3 bgColor = u_bgColor;
      
      float fieldSum = 0.0;
      vec3 weightedColorSum = vec3(0.0);
      
      for (int i = 0; i < 6; i++) {
        if (i >= u_circleCount) { break; }
        
        vec3 posRad = u_circlesPosRad[i];
        vec2 cPos = vec2(posRad.r, posRad.g);
        float radius = posRad.b;
        
        float dist = length(st - cPos);
        float sigma = radius * 0.5;
        float val = exp(- (dist * dist) / (2.0 * sigma * sigma));
        
        fieldSum += val;
        weightedColorSum += u_circlesColor[i] * val;
      }
      
      vec3 finalCirclesColor = vec3(0.0);
      if (fieldSum > 0.0) {
        finalCirclesColor = weightedColorSum / fieldSum;
      }
      
      // Usar solo los colores de los círculos sin mezclar con colores hardcodeados
      float intensity = pow(fieldSum, 1.4);
      vec3 finalColor = mix(bgColor, finalCirclesColor, clamp(intensity, 0.0, 1.0));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const initWebGL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }

    glRef.current = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return false;

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;
    gl.useProgram(program);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    return true;
  };

  const initCircles = () => {
    if (!dimensions.width || !dimensions.height) return;

    const rgbColors = convertColors(colors);
    const circles: Circle[] = [];
    const baseRadius = (dimensions.width + dimensions.height) * config.radiusMultiplier;

    for (let i = 0; i < config.movingCircles; i++) {
      const radius = baseRadius;
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const speedMultiplier = Math.random() * 4 + 1;
      const vx = (Math.random() - 0.5) * config.speedMultiplier * speedMultiplier;
      const vy = (Math.random() - 0.5) * config.speedMultiplier * speedMultiplier;

      circles.push({
        x,
        y,
        radius,
        color: rgbColors[i % rgbColors.length],
        vx,
        vy,
        interactive: false,
      });
    }

    const interactiveRadius = (dimensions.width + dimensions.height) * 0.1;
    circles.push({
      x: dimensions.width / 2,
      y: dimensions.height / 2,
      radius: interactiveRadius,
      color: rgbColors[rgbColors.length - 1],
      vx: 0,
      vy: 0,
      interactive: true,
    });

    circlesRef.current = circles;
  };

  const updateCircles = () => {
    if (!isPlaying) return;

    circlesRef.current.forEach(circle => {
      if (!circle.interactive) {
        circle.x += circle.vx;
        circle.y += circle.vy;

        if (circle.x - circle.radius > dimensions.width) circle.x = -circle.radius;
        if (circle.x + circle.radius < 0) circle.x = dimensions.width + circle.radius;
        if (circle.y - circle.radius > dimensions.height) circle.y = -circle.radius;
        if (circle.y + circle.radius < 0) circle.y = dimensions.height + circle.radius;
      } else {
        circle.x += (mouseRef.current.x - circle.x) * 0.1;
        circle.y += (mouseRef.current.y - circle.y) * 0.1;
      }
    });
  };

  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;

    if (!gl || !program) return;

    updateCircles();

    gl.viewport(0, 0, dimensions.width, dimensions.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    const u_resolution = gl.getUniformLocation(program, 'u_resolution');
    const u_circleCount = gl.getUniformLocation(program, 'u_circleCount');
    const u_circlesColor = gl.getUniformLocation(program, 'u_circlesColor');
    const u_circlesPosRad = gl.getUniformLocation(program, 'u_circlesPosRad');
    const u_mouse = gl.getUniformLocation(program, 'u_mouse');
    const u_isPlaying = gl.getUniformLocation(program, 'u_isPlaying');
    const u_bgColor = gl.getUniformLocation(program, 'u_bgColor');

    gl.uniform2f(u_resolution, dimensions.width, dimensions.height);
    gl.uniform1i(u_circleCount, circlesRef.current.length);
    gl.uniform2f(u_mouse, mouseRef.current.x, mouseRef.current.y);
    gl.uniform1i(u_isPlaying, isPlaying ? 1 : 0);

    const rgbColors = convertColors(colors);
    const bgColor = rgbColors[0];
    const darkerBgColor = [bgColor[0] * 0.3, bgColor[1] * 0.3, bgColor[2] * 0.3];
    gl.uniform3f(u_bgColor, darkerBgColor[0], darkerBgColor[1], darkerBgColor[2]);

    const colorsArr: number[] = [];
    const posRadArr: number[] = [];

    for (let i = 0; i < 6; i++) {
      if (i < circlesRef.current.length) {
        const circle = circlesRef.current[i];
        colorsArr.push(circle.color[0], circle.color[1], circle.color[2]);
        posRadArr.push(circle.x, circle.y, circle.radius);
      } else {
        colorsArr.push(0, 0, 0);
        posRadArr.push(0, 0, 0);
      }
    }

    gl.uniform3fv(u_circlesColor, new Float32Array(colorsArr));
    gl.uniform3fv(u_circlesPosRad, new Float32Array(posRadArr));

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      setDimensions({
        width: rect.width * dpr,
        height: rect.height * dpr,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    if (initWebGL()) {
      initCircles();
      animationRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, colors, intensity]);

  useEffect(() => {
    if (isPlaying && !animationRef.current) {
      animationRef.current = requestAnimationFrame(render);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};