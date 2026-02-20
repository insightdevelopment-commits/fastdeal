import React, { useEffect, useRef } from 'react';

const Background = ({ scrollContainer, problemHover, speed = 1 }) => { // Accept speed prop
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const smoothedScrollRef = useRef(0); // Smooth scroll value for animation
    const speedRef = useRef(speed); // Initialize with prop

    // Update ref when prop changes, avoiding re-init of canvas
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        let animationFrameId;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // --- CONFIGURATION ---
        const COLORS = {
            bg: '#050005',
            primary: '#8A2BE2', // Electric Purple
            magenta: '#FF00FF', // Neon Magenta
            danger: '#FF416C', // Red
            success: '#00FFBE', // Green
            alert: '#FF0000', // Pure Red
        };

        // --- UTILS ---
        const random = (min, max) => Math.random() * (max - min) + min;
        const lerp = (a, b, t) => a + (b - a) * t;

        // --- SCENE CLASSES ---

        // SCENE 1 & 6: Data Geometry
        class GeoLayer {
            constructor(isVertical = false) {
                this.nodes = [];
                this.isVertical = isVertical;
                this.init();
            }

            init() {
                for (let i = 0; i < 40; i++) {
                    this.nodes.push({
                        x: random(0, width),
                        y: random(0, height),
                        vx: this.isVertical ? random(-0.2, 0.2) : random(-0.5, 0.5),
                        vy: this.isVertical ? random(0.5, 2.0) : random(-0.2, 0.2),
                        size: random(2, 5),
                        hexSize: random(10, 20)
                    });
                }
            }

            draw(ctx, opacity, mx, my, currentSpeed) {
                if (opacity <= 0.01) return;
                ctx.save();
                ctx.globalAlpha = opacity;
                const px = (mx - width / 2) * -0.02;
                const py = (my - height / 2) * -0.02;
                ctx.translate(px, py);
                ctx.strokeStyle = COLORS.primary;
                ctx.fillStyle = COLORS.primary;

                this.nodes.forEach(n => {
                    n.x += n.vx * currentSpeed;
                    n.y += n.vy * currentSpeed;
                    if (n.x < -50) n.x = width + 50;
                    if (n.x > width + 50) n.x = -50;
                    if (n.y < -50) n.y = height + 50;
                    if (n.y > height + 50) n.y = -50;

                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const ang = Math.PI / 3 * i;
                        const hx = n.x + n.hexSize * Math.cos(ang);
                        const hy = n.y + n.hexSize * Math.sin(ang);
                        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    this.nodes.forEach(n2 => {
                        const dx = n.x - n2.x;
                        const dy = n.y - n2.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 100) {
                            ctx.globalAlpha = opacity * (1 - d / 100) * 0.3;
                            ctx.beginPath();
                            ctx.moveTo(n.x, n.y);
                            ctx.lineTo(n2.x, n2.y);
                            ctx.stroke();
                            ctx.globalAlpha = opacity;
                        }
                    });
                });
                ctx.restore();
            }
        }

        // SCENE 2: Volatility Graphs
        class ChaosGraphs {
            constructor() {
                this.graphs = [];
                for (let i = 0; i < 6; i++) { // Reduced count back down to avoid clutter
                    this.graphs.push(new SingleGraph());
                }
            }

            draw(ctx, opacity, isHovered, currentSpeed) { // Accept hover state
                if (opacity <= 0.01) return;
                ctx.save();
                // "Make them little bit hided" -> Reduce global alpha back down
                ctx.globalAlpha = opacity * (isHovered ? 0.8 : 0.4); // More visible when hovered
                this.graphs.forEach(g => {
                    g.update(isHovered, currentSpeed);
                    g.draw(ctx, isHovered);
                });
                ctx.restore();
            }
        }

        class SingleGraph {
            constructor() {
                this.w = random(width * 0.8, width * 1.5); // Span almost entire screen
                this.x = random(-width * 0.2, 0); // Start from left
                this.y = random(height * 0.3, height * 0.7);
                this.points = [];
                let v = 0.5;
                // Reduce point count but spread them out more for disjointed look fix?
                // Actually user said "not connected", maybe they meant gaps?
                // If I use moveTo/lineTo they are connected.
                for (let i = 0; i < 80; i++) {
                    v = Math.max(0.2, Math.min(0.8, v + random(-0.15, 0.15)));
                    this.points.push(v);
                }
                this.trend = 0;
            }

            update(isHovered, currentSpeed) {
                // Only update every few frames or based on speed?
                // Let's just update every frame but scaled by speed if needed, 
                // though usually graphs just shift. 
                // Let's make "agitation" speed based.
                // if (Math.random() > 0.5 * currentSpeed) return; // Skip frames if slow? No, choppy.

                // Better: shift proportional to speed
                // Since this.points.shift() removes one element, we can't easily do partial shifts.
                // We'll use a probability check based on speed to possibly skip an update if speed < 1
                // OR execute multiple times if speed > 1 (simple approach) or just trust the visual flow.

                // Let's stick to update-per-frame but modify the VALUE changes by speed.

                this.points.shift();
                const last = this.points[this.points.length - 1];

                // Agitated state math
                const volatility = (isHovered ? 0.3 : 0.15) * currentSpeed; // Double volatility
                const driftIntensity = (isHovered ? 0.6 : 0.3) * currentSpeed;

                // Smoother transitions
                if (Math.random() < 0.05) this.trendDir = Math.random() > 0.5 ? 1 : -1;
                const drift = (Math.random() - 0.5) * driftIntensity;
                const bias = (this.trendDir || 0) * (isHovered ? 0.2 : 0.1);

                let next = last + drift + bias;
                // Hard clamp
                next = Math.max(0.05, Math.min(0.95, next));

                this.points.push(next);

                // Recalculate trend logic lightly
                const start = this.points[0];
                const end = this.points[this.points.length - 1];
                this.trend = end >= start ? 1 : -1;
            }

            draw(ctx, isHovered) {
                ctx.beginPath();
                const step = this.w / this.points.length;

                // Use gradient for connection feeling?
                // Or just solid color
                // Color switch on hover
                const color = isHovered ? COLORS.alert : (this.trend === 1 ? COLORS.success : COLORS.danger);

                ctx.strokeStyle = color;
                ctx.lineWidth = isHovered ? 4 : 2; // Thicker on hover
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round'; // Smooth corners

                // Soft Glow
                ctx.shadowBlur = isHovered ? 30 : 10;
                ctx.shadowColor = color;

                // Draw curve instead of straight lines? No, jagged is good for volatility.
                // But let's ensure no gaps.
                for (let i = 0; i < this.points.length; i++) {
                    const px = this.x + i * step;
                    // Spike amplitude
                    const amp = isHovered ? 200 : 120;
                    const py = this.y + (this.points[i] * amp) - (amp / 2);
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // SCENE 3: Chronological Analytics (Relevance) - "The Timeline Sweep"
        class ChronoCharts {
            constructor() {
                this.bars = [];
                this.sweepProgress = 0; // State for auto-animation
                const barCount = 50;
                for (let i = 0; i < barCount; i++) {
                    this.bars.push({
                        // Base noise for fluctuating height
                        noiseOffset: random(0, 1000),
                        x: (width * 0.8 / barCount) * i + (width * 0.1),
                        w: (width * 0.6 / barCount),
                        maxH: random(50, 200)
                    });
                }
            }

            draw(ctx, opacity, progressIntoSection, currentSpeed) {
                if (opacity <= 0.01) {
                    // Reset if scrolled out significantly?
                    // Optional: keep it filling if user scrolls back up?
                    // Let's reset if completely out of view for re-playability
                    if (progressIntoSection < -0.5 || progressIntoSection > 1.5) {
                        this.sweepProgress = 0;
                    }
                    return;
                }
                ctx.save();
                ctx.globalAlpha = opacity;

                // Auto-Sweep Logic
                // If section is visible (opacity > 0.1), animate
                if (opacity > 0.1) {
                    // Initialize direction if not present (using a property on the class)
                    if (typeof this.direction === 'undefined') this.direction = 1;

                    // Slower speed: 0.002 (approx 8s per sweep at 60fps)
                    // Apply speed multiplier
                    this.sweepProgress += 0.002 * this.direction * currentSpeed;

                    // Ping-pong bounds
                    if (this.sweepProgress >= 1) {
                        this.sweepProgress = 1;
                        this.direction = -1;
                    } else if (this.sweepProgress <= 0) {
                        this.sweepProgress = 0;
                        this.direction = 1;
                    }
                }

                // Use the internal state
                const reveal = this.sweepProgress;

                // Axis Line (Red as requested or thematic)
                // User mentioned "red line". Let's use Danger color or Magenta->Red gradient
                const axisY = height - 150;

                const gradLine = ctx.createLinearGradient(width * 0.1, 0, width * 0.9, 0);
                gradLine.addColorStop(0, COLORS.primary); // Violet start
                gradLine.addColorStop(1, COLORS.magenta); // Magenta end

                ctx.beginPath();
                ctx.strokeStyle = gradLine;
                ctx.lineWidth = 2;
                ctx.moveTo(width * 0.1, axisY);
                ctx.lineTo(width * 0.9, axisY);
                ctx.stroke();

                // Current "Head" Position
                const headX = (width * 0.1) + (width * 0.8) * reveal;

                // Draw Bars
                this.bars.forEach((b, i) => {
                    const barProgress = i / this.bars.length;

                    // State: Future (Hidden), Head (Active), Past (Ghost)
                    let barAlpha = 0;
                    let barH = 0;
                    let barColor = COLORS.primary;

                    // Distance from Head
                    const dist = headX - b.x;

                    if (dist >= 0) {
                        // Past or Current
                        if (dist < 100) {
                            // The "Head" / Active Sweep
                            // High Opacity, Fluctuating Height
                            barAlpha = 1;

                            // Dynamic Height Calculation (Pulse)
                            const time = Date.now() * 0.005 * currentSpeed; // Speed up pulses too
                            const noise = Math.sin(b.noiseOffset + time) * 0.5 + 0.5; // 0-1
                            barH = b.maxH * (0.6 + noise * 0.4);

                            // Color Transition at Head (Violet -> Magenta)
                            // Interpolate based on overall progress (reveal)
                            // Simple lerp helper for colors would be complex here, 
                            // closer to Violet at 0, Magenta at 1.
                            // Let's use style
                            barColor = reveal > 0.8 ? COLORS.magenta : (reveal < 0.2 ? '#4B0082' : COLORS.primary);
                            if (dist < 20) barColor = COLORS.white; // Leading edge highlight
                        } else {
                            // "Ghost" Trail
                            // Low Opacity (10% requested)
                            barAlpha = 0.1;
                            barH = b.maxH * 0.7; // Static-ish "snapshot" height
                            // Gradient Color based on X (4B0082 -> FF00FF)
                            // Approximate logic: 
                            // We set fillStyle later.
                        }
                    } else {
                        // Future - invisible or faint outline?
                        // User request implies "sweep across", usually starts empty.
                        barAlpha = 0;
                    }

                    if (barAlpha > 0) {
                        const currentH = barH;

                        // Determine concrete color for the bar
                        // We want a gradient across the screen for the trails
                        if (barAlpha < 0.5) {
                            // Trail color logic
                            // Left side (start) = Deep Violet (#4B0082)
                            // Right side (end) = Neon Magenta (#FF00FF)
                            // Progress = barProgress
                            // Canvas doesn't lerp hex easily without helper, but we can do a hack or use HSL
                            // Violet is roughly H:275, Magenta is H:300.
                            const h = 275 + (barProgress * 25);
                            const l = 25 + (barProgress * 25); // Darker to Light
                            ctx.fillStyle = `hsla(${h}, 100 %, ${l} %, ${barAlpha})`;
                        } else {
                            // Head color
                            ctx.fillStyle = barColor;
                            ctx.globalAlpha = opacity * 1; // Pulse head
                        }

                        if (barAlpha < 0.5) ctx.globalAlpha = opacity * 0.1;

                        ctx.fillRect(b.x, axisY - currentH, b.w, currentH);

                        // If head, add glow
                        if (barAlpha === 1) {
                            ctx.shadowBlur = 20;
                            ctx.shadowColor = COLORS.magenta;
                            ctx.fillRect(b.x, axisY - currentH, b.w, currentH);
                            ctx.shadowBlur = 0;
                        }
                    }
                });

                // Draw Year Markers (Fixed)
                const years = [2022, 2023, 2024, 2025, 2026];
                ctx.fillStyle = COLORS.white;
                ctx.font = '12px "JetBrains Mono"';
                ctx.textAlign = 'center';

                years.forEach((y, idx) => {
                    const yX = (width * 0.1) + (width * 0.8) * (idx / (years.length - 1));

                    // Highlight if passed
                    const isPassed = headX >= yX;
                    ctx.globalAlpha = isPassed ? opacity : opacity * 0.3;
                    ctx.fillText(y, yX, axisY + 20);

                    // Tick
                    ctx.fillRect(yX - 1, axisY, 2, 10);
                });

                ctx.textAlign = 'start'; // Reset
                ctx.restore();
            }
        }

        // SCENE 4: Targeted Geometry (Goal)
        class TargetGeo {
            constructor() {
                this.tiltX = 0;
                this.tiltY = 0;
                this.clusters = [];

                // Scatter points to "fill the back" (Left/Right/Center)
                const points = [
                    { x: 0.5, y: 0.5, s: 1.0 },   // Center
                    { x: 0.15, y: 0.25, s: 0.6 }, // Left Top
                    { x: 0.1, y: 0.8, s: 0.7 },   // Left Bottom
                    { x: 0.85, y: 0.2, s: 0.7 },  // Right Top
                    { x: 0.9, y: 0.75, s: 0.6 },  // Right Bottom
                    { x: 0.3, y: 0.6, s: 0.5 },   // Mid filler
                    { x: 0.7, y: 0.4, s: 0.5 }    // Mid filler
                ];

                points.forEach(p => {
                    const rings = [];
                    // Dense but small rings per cluster
                    const ringCount = 15;
                    for (let i = 0; i < ringCount; i++) {
                        rings.push({
                            phase: i * (1 / ringCount),
                            speed: random(0.0002, 0.0004)
                        });
                    }
                    this.clusters.push({ ...p, rings });
                });
            }

            draw(ctx, opacity, mx, my, currentSpeed) {
                if (opacity <= 0.01) return;
                ctx.save();
                // "Hided" global opacity
                ctx.globalAlpha = opacity * 0.3;

                // Smooth "Magnetic" tilt
                const targetTx = (mx - width / 2) * 0.10;
                const targetTy = (my - height / 2) * 0.10;
                this.tiltX = lerp(this.tiltX, targetTx, 0.05);
                this.tiltY = lerp(this.tiltY, targetTy, 0.05);

                this.clusters.forEach(c => {
                    // Parallax effect based on scale (smaller = further = less movement)
                    const cx = width * c.x + this.tiltX * c.s;
                    const cy = height * c.y + this.tiltY * c.s;

                    ctx.save();
                    ctx.translate(cx, cy);
                    const entrance = 0.8 + (opacity * 0.2);
                    const scale = c.s * entrance;
                    ctx.scale(scale, scale);

                    ctx.lineWidth = 0.5;

                    c.rings.forEach(r => {
                        r.phase -= r.speed * currentSpeed;
                        if (r.phase < 0) r.phase = 1;

                        // Small, dense scale
                        const s = 300 * Math.pow(r.phase, 2.5);

                        // Alpha fades at edges and center
                        let alpha = Math.sin(r.phase * Math.PI);

                        ctx.save();
                        const rot = (Date.now() * 0.0001 * currentSpeed) + (r.phase * 2);
                        ctx.rotate(rot);
                        ctx.globalAlpha = opacity * alpha * 0.3; // Low local alpha

                        // Primary Triangle (Green)
                        ctx.strokeStyle = COLORS.success;
                        ctx.beginPath();
                        for (let j = 0; j < 3; j++) {
                            const a = (Math.PI * 2 / 3) * j - Math.PI / 2;
                            const x = Math.cos(a) * s;
                            const y = Math.sin(a) * s;
                            if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.stroke();

                        // Secondary Echo (Violet) - "Designed" feel
                        ctx.strokeStyle = COLORS.primary;
                        ctx.beginPath();
                        for (let j = 0; j < 3; j++) {
                            const a = (Math.PI * 2 / 3) * j + Math.PI / 2; // Inverted
                            const x = Math.cos(a) * (s * 0.7);
                            const y = Math.sin(a) * (s * 0.7);
                            if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.stroke();

                        // Tiny Dots (Magenta)
                        ctx.fillStyle = COLORS.magenta;
                        for (let j = 0; j < 3; j++) {
                            const a = (Math.PI * 2 / 3) * j - Math.PI / 2;
                            const x = Math.cos(a) * s;
                            const y = Math.sin(a) * s;
                            ctx.beginPath();
                            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    });

                    ctx.restore();
                });

                ctx.restore();
            }
        }

        // SCENE 5: Solution Graph
        class SolutionGraph {
            draw(ctx, opacity, progressIntoSection) {
                if (opacity <= 0.01) return;
                ctx.save();
                ctx.globalAlpha = opacity;

                // Scale up slightly for "massive" feel, but clamp it to avoid infinite growth
                // progressIntoSection is 0 at start of section, 1 at end.
                // When we are at FAQ logic, progress is 1+.
                // Clamp max scale to 1.5
                const effectiveProgress = Math.max(-1, Math.min(progressIntoSection, 2.5));
                const scale = 1.0 + (effectiveProgress * 0.2);

                ctx.translate(width / 2, height);
                ctx.scale(scale, scale);
                ctx.translate(-width / 2, 0);

                // Gradient: Green (Top) to Transparent/Purple (Bottom)
                const grd = ctx.createLinearGradient(0, -height * 0.8, 0, 0);
                grd.addColorStop(0, COLORS.success);
                grd.addColorStop(1, 'rgba(138, 43, 226, 0.1)'); // Fade to transparent purple

                ctx.beginPath();
                ctx.moveTo(0, 0);
                // Massive curve reaching 70-80% height
                ctx.bezierCurveTo(width * 0.25, -height * 0.4, width * 0.5, -height * 0.9, width, -height * 0.6);
                ctx.lineTo(width, 0);
                ctx.closePath();

                // Fill with gradient and LOWER glow ("more hided")
                ctx.fillStyle = grd;
                ctx.globalAlpha = 0.05 * opacity; // Very faint (was 0.1)
                ctx.shadowBlur = 5; // Minimal glow (was 20)
                ctx.shadowColor = COLORS.success;
                ctx.fill();

                // Stroke
                ctx.lineWidth = 1; // Thinnest
                ctx.strokeStyle = COLORS.success;
                ctx.globalAlpha = 0.2 * opacity; // Faint stroke (was 0.4)
                ctx.shadowBlur = 5; // Minimal glow
                ctx.shadowColor = COLORS.success;
                ctx.stroke();

                ctx.shadowBlur = 0; // Reset
                ctx.restore();
            }
        }

        const scene1 = new GeoLayer(false);
        const scene2 = new ChaosGraphs();
        const scene3 = new ChronoCharts();
        const scene4 = new TargetGeo();
        const scene5 = new SolutionGraph();
        const scene6 = new GeoLayer(true);

        const sectionIds = ['start', 'problem', 'relevance', 'waitlist', 'solution', 'faq', 'contact'];
        let sectionMetrics = [];

        const measureSections = () => {
            sectionMetrics = sectionIds.map((id, index) => {
                const el = document.getElementById(id);
                if (el) {
                    return {
                        id,
                        index,
                        top: el.offsetTop,
                        height: el.offsetHeight
                    };
                }
                // Fallback if element not found (shouldn't happen if structure is stable)
                return { id, index, top: index * height, height: height };
            });
        };

        const getCalculatedScrollProgress = (scrollY) => {
            if (sectionMetrics.length === 0) return 0;

            // Normalize per section
            // We map scrollY to a continuous range 0..N
            // To avoid gaps (margins) causing "fall-through" to the default case,
            // we define the section "segment" as starting at current.top and ending at next.top.

            for (let i = 0; i < sectionMetrics.length; i++) {
                const m = sectionMetrics[i];
                const nextM = sectionMetrics[i + 1];

                // If it's the last section, handle it simply
                if (!nextM) {
                    if (scrollY >= m.top) {
                        // Progress based on its own height? 
                        // Or just cap at index if we are past it?
                        // Let's allow it to grow slightly or clamp.
                        const progress = (scrollY - m.top) / m.height;
                        return m.index + Math.min(progress, 1); // Clamp to prevent index overflow issues?
                    }
                    continue; // Should be handled by top check or previous loop iteration
                }

                // For all other sections:
                // The "effective height" includes any margin/gap until the next section starts.
                const effectiveHeight = nextM.top - m.top;

                // Check if scrollY is within this segment [m.top, nextM.top)
                if (scrollY >= m.top && scrollY < nextM.top) {
                    const progress = (scrollY - m.top) / effectiveHeight;
                    return m.index + progress;
                }
            }

            // If scrollY is before the first section (e.g. negative bounce?)
            if (scrollY < sectionMetrics[0].top) return 0;

            // Fallback: If for some reason we fell through (e.g. at the very end past last section top)
            return sectionMetrics.length - 1;
        };

        const render = () => {
            if (document.hidden) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // Smoothly interpolate current speed towards target speed
            speedRef.current = lerp(speedRef.current, speed, 0.05);
            const currentSpeed = speedRef.current;

            // Smoothly interpolate scroll position
            smoothedScrollRef.current = lerp(smoothedScrollRef.current, scrollRef.current, 0.08);
            const scrollY = smoothedScrollRef.current;

            const isLightMode = document.documentElement.classList.contains('light-mode');

            ctx.globalAlpha = 1;
            ctx.fillStyle = isLightMode ? '#ffffff' : COLORS.bg;
            ctx.fillRect(0, 0, width, height);

            const t = Date.now() * 0.0005 * currentSpeed;
            const grad1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
            grad1.addColorStop(0, isLightMode ? 'rgba(138, 43, 226, 0.05)' : 'rgba(75, 0, 130, 0.15)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, width, height);

            // const scrollY = scrollRef.current; // Replaced by smoothed scrollY above
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Calculate progress based on actual DOM elements
            const scrollProgress = getCalculatedScrollProgress(scrollY);

            // Helper to get opacity for a specific section index
            // Wider curve for smoother/longer overlap
            const getSceneOpacity = (idx) => {
                const dist = Math.abs(scrollProgress - idx);

                // Special case for Footer (last section, index 6)
                // Allow it to start fading in much earlier (when we are leaving FAQ)
                if (idx === 6) {
                    if (scrollProgress > 5.0) { // FAQ is 5.
                        // We want it to start appearing as soon as we leave 5.
                        // dist is (scrollProgress - 6). at 5.0 dist is 1.0.
                        // Standard logic: if dist > 1.2 return 0. (1.0 < 1.2 so it works)
                        // But let's make it linear or smoother?
                        // Let's use standard logic but maybe boost it slightly?
                    }
                }

                // Allow visibility for longer distance (up to 1.2 screens away)
                // and use a curve that stays higher for longer (cosine or power)
                if (dist > 1.2) return 0;
                return Math.pow(Math.max(0, 1 - (dist / 1.2)), 2); // Squared falloff feels smoother
            };

            // Persistent Geometric Layer (Global background)
            // User requested "Start" shapes (scene1) everywhere.
            scene1.draw(ctx, 0.3, mx, my, currentSpeed);

            // Section-specific overlays
            // scene1 is now global, so we don't need to draw it again with getSceneOpacity(0)
            // unless we want to boost it on the first section.
            if (getSceneOpacity(0) > 0.3) {
                scene1.draw(ctx, getSceneOpacity(0) - 0.3, mx, my, currentSpeed);
            }

            // Full-circle loop: Show Start shapes again at the bottom (Footer / Contact) at 5% opacity
            // Disabled to maintain Solution background consistency
            /*
            const footerOpacity = getSceneOpacity(6);
            if (footerOpacity > 0) {
                // Slightly increased opacity for smoother blend
                scene1.draw(ctx, footerOpacity * 0.25, mx, my, currentSpeed);
            }
            */

            // Scene 5: Solution Graph
            // User requested to "not change background after solution".
            // So we keep Scene 5 fully visible for everything after it (FAQ, Footer).
            let solutionOpacity = getSceneOpacity(4);
            if (scrollProgress > 4) {
                solutionOpacity = 1; // Keep it fully visible
            }
            scene5.draw(ctx, solutionOpacity, scrollProgress - 4);

            // Scene 6: Vertical Data (FAQ) - Disabled per request
            // scene6.draw(ctx, getSceneOpacity(5), mx, my, currentSpeed);

            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            measureSections();
        };
        const handleMouseMove = (e) => mouseRef.current = { x: e.clientX, y: e.clientY };

        // Listen to container scroll if provided, else window (fallback)
        const handleScroll = (e) => {
            // If event is provided (from container) use e.target.scrollTop
            // If window, use window.scrollY
            if (e && e.target) {
                scrollRef.current = e.target.scrollTop;
            } else {
                scrollRef.current = window.scrollY;
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        let scroller = window;
        if (scrollContainer && scrollContainer.current) {
            scroller = scrollContainer.current;
            scroller.addEventListener('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
        }

        handleResize();
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (scroller) scroller.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [scrollContainer]); // Removed speed from dependencies

    return (
        <div className="fixed inset-0 z-0 bg-obsidian pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default Background;
