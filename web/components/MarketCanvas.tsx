"use client";

import { useRef, useEffect } from "react";

export default function MarketCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const dataRef = {
      greenPts: [] as number[],
      redPts: [] as number[],
      candles: [] as { o: number; h: number; l: number; c: number }[],
      offset: 0,
      numberGrid: [] as { val: string; up: boolean }[][],
      lastGridUpdate: 0,
    };

    const N = 200;
    const gen = (start: number, vol: number) => {
      const pts = [start];
      for (let i = 1; i < N; i++) pts.push(Math.max(0.05, pts[i - 1] + (Math.random() - 0.48) * vol));
      return pts;
    };
    const genCandles = (count: number) => Array.from({ length: count }, () => {
      const o = Math.random();
      const c = o + (Math.random() - 0.5) * 0.12;
      const h = Math.max(o, c) + Math.random() * 0.04;
      const l = Math.min(o, c) - Math.random() * 0.04;
      return { o, h, l, c };
    });

    dataRef.greenPts = gen(0.5, 0.045);
    dataRef.redPts = gen(0.45, 0.06);
    dataRef.candles = genCandles(60);

    const cols = 6;
    const rows = 10;
    const initGrid = () => Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => ({
        val: (Math.random() * 99999 + 1000).toFixed(0),
        up: Math.random() > 0.45
      }))
    );
    dataRef.numberGrid = initGrid();

    const drawChart = (pts: number[], color: string, glowColor: string, yBase: number, yRange: number, xOff: number, thickness = 2) => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const step = w / (pts.length - 1);
      
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      ctx.lineJoin = "round";
      
      pts.forEach((p, i) => {
        const x = i * step + xOff;
        const y = h * yBase - p * h * yRange;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = glowColor;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Brighter Grid
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.8;
      for (let x = 0; x < w; x += 80) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += 80) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();

      dataRef.offset -= 0.6;
      if (dataRef.offset < -w) dataRef.offset = 0;

      const glitch = Math.random() > 0.98 ? (Math.random() - 0.5) * 5 : 0;

      // Draw main glowing charts
      drawChart(dataRef.greenPts, "rgba(16, 185, 129, 0.6)", "#10b981", 0.55, 0.35, dataRef.offset + glitch, 2.5);
      drawChart(dataRef.greenPts, "rgba(16, 185, 129, 0.6)", "#10b981", 0.55, 0.35, dataRef.offset + w + glitch, 2.5);
      
      drawChart(dataRef.redPts, "rgba(239, 68, 68, 0.5)", "#ef4444", 0.65, 0.45, dataRef.offset * 0.8, 1.8);
      drawChart(dataRef.redPts, "rgba(239, 68, 68, 0.5)", "#ef4444", 0.65, 0.45, dataRef.offset * 0.8 + w, 1.8);

      // Render Brighter Candles
      dataRef.candles.forEach((c, i) => {
        const x = (i * 45 + dataRef.offset * 1.5) % (w + 50) - 25;
        const yCenter = h * 0.4;
        const candleH = 80;
        
        const color = c.c > c.o ? "rgba(16, 185, 129, 0.6)" : "rgba(239, 68, 68, 0.6)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yCenter - c.h * candleH);
        ctx.lineTo(x, yCenter - c.l * candleH);
        ctx.stroke();

        ctx.fillStyle = c.c > c.o ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)";
        const rectH = Math.abs(c.c - c.o) * candleH;
        const rectY = yCenter - Math.max(c.o, c.c) * candleH;
        ctx.fillRect(x - 4, rectY, 8, Math.max(3, rectH));
        
        if (Math.abs(c.c - c.o) > 0.05) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = c.c > c.o ? "#10b981" : "#ef4444";
          ctx.strokeRect(x - 4, rectY, 8, Math.max(3, rectH));
          ctx.shadowBlur = 0;
        }
      });

      // Scrolling Numbers Grid (More visible)
      const now = Date.now();
      if (now - dataRef.lastGridUpdate > 1200) {
        dataRef.numberGrid = dataRef.numberGrid.map(row => 
          row.map(cell => Math.random() > 0.7 ? { val: (Math.random() * 99999 + 1000).toFixed(0), up: Math.random() > 0.45 } : cell)
        );
        dataRef.lastGridUpdate = now;
      }

      ctx.font = "bold 9px monospace";
      const colStep = w / 6;
      const rowStep = h / 10;
      dataRef.numberGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          ctx.fillStyle = cell.up ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)";
          ctx.fillText(cell.val, c * colStep + 20, r * rowStep + 40);
        });
      });

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
    />
  );
}
