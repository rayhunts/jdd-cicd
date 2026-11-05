import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export default function Welcome() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            paintBackdrop(canvasRef.current);
        }
    }, []);

    return (
        <>
            <Head title="No More FTP Drag-and-Drop" />
            <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                aria-hidden="true"
                className="fixed inset-0 h-full w-full bg-[#12261E] object-cover"
            />
            <div className="relative z-10 flex min-h-screen flex-col px-4 py-6 font-['Plus_Jakarta_Sans'] text-[#F4F7EF] sm:px-8 lg:px-16">
                <header>
                    <span className="font-['JetBrains_Mono'] text-sm text-[#C6D4CA]">
                        JDD 2026
                    </span>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-16">
                    <Glass
                        className="rounded-[44px] px-6 py-10 sm:px-12 sm:py-14"
                        strength={150}
                        depth={14}
                    >
                        <code className="inline-block rounded-full bg-[#06120D]/70 px-4 py-2 font-['JetBrains_Mono'] text-sm text-[#D4E03C] sm:text-base">
                            $ git push origin main
                        </code>
                        <h1 className="mt-6 text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
                            No More FTP
                            <br />
                            Drag-and-Drop
                        </h1>
                        <p className="mt-6 max-w-2xl text-xl text-[#DDE7DF] sm:text-2xl">
                            Pro-Level Laravel Deploys on a{' '}
                            <span className="font-bold text-[#D4E03C]">
                                Shared Hosting Budget
                            </span>
                        </p>
                        <div className="mt-10 border-t border-white/15 pt-6">
                            <p className="text-lg font-bold">
                                Muhammad Roihan Ainul Yaqin
                            </p>
                            <p className="text-[#C6D4CA]">
                                Product Engineer at Zero One Group
                            </p>
                        </div>
                    </Glass>
                </main>
            </div>
        </>
    );
}

/*
 * Liquid glass. Port of nikdelvin/liquid-glass (MIT, (c) 2025 Nikita Stadnik).
 * Real refraction via SVG backdrop-filter in Chromium; frosted blur fallback elsewhere.
 */
function Glass({
    className = '',
    children,
    depth = 10,
    strength = 100,
    ca = 2,
}: {
    className?: string;
    children: ReactNode;
    depth?: number;
    strength?: number;
    ca?: number;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const panel = panelRef.current;
        const layer = layerRef.current;

        if (!panel || !layer) {
            return;
        }

        const draw = () => {
            const w = Math.round(panel.offsetWidth);
            const h = Math.round(panel.offsetHeight);
            const r = Math.min(
                parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 0,
                h / 2,
            );
            const filter = supportsSvgBackdrop()
                ? `url('${lgFilter(h, w, r, depth, strength, ca)}') brightness(1.1) saturate(1.5)`
                : `blur(${Math.min(w / 10, 24)}px) saturate(180%)`;
            layer.style.backdropFilter = filter;
            layer.style.setProperty('-webkit-backdrop-filter', filter);
        };

        draw();
        const observer = new ResizeObserver(draw);
        observer.observe(panel);

        return () => observer.disconnect();
    }, [depth, strength, ca]);

    return (
        <div
            ref={panelRef}
            className={`relative isolate overflow-hidden ${className}`}
        >
            <div
                ref={layerRef}
                className="absolute inset-0 -z-10 rounded-[inherit] bg-[#06120D]/55 shadow-[inset_0_0_4px_0_#fafafa80]"
            />
            {children}
        </div>
    );
}

let svgBackdropSupport: boolean | undefined;

function supportsSvgBackdrop(): boolean {
    if (svgBackdropSupport === undefined) {
        const probe = document.createElement('div');
        probe.style.cssText = 'backdrop-filter:url(#t)';
        svgBackdropSupport = /url/.test(probe.style.backdropFilter);
    }

    return svgBackdropSupport;
}

function lgMap(h: number, w: number, r: number, d: number): string {
    const y = Math.ceil((r / h) * 15);
    const x = Math.ceil((r / w) * 15);

    return (
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg height="${h}" width="${w}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><style>.mix{mix-blend-mode:screen}</style><defs><linearGradient id="Y" x1="0" x2="0" y1="${y}%" y2="${100 - y}%"><stop offset="0%" stop-color="#0F0"/><stop offset="100%" stop-color="#000"/></linearGradient><linearGradient id="X" x1="${x}%" x2="${100 - x}%" y1="0" y2="0"><stop offset="0%" stop-color="#F00"/><stop offset="100%" stop-color="#000"/></linearGradient></defs><rect width="${w}" height="${h}" fill="#808080"/><g filter="blur(2px)"><rect width="${w}" height="${h}" fill="#000080"/><rect width="${w}" height="${h}" fill="url(#Y)" class="mix"/><rect width="${w}" height="${h}" fill="url(#X)" class="mix"/><rect x="${d}" y="${d}" width="${w - 2 * d}" height="${h - 2 * d}" fill="#808080" rx="${r}" ry="${r}" filter="blur(${d}px)"/></g></svg>`,
        )
    );
}

function lgFilter(
    h: number,
    w: number,
    r: number,
    d: number,
    s: number,
    ca: number,
): string {
    const displace = (scale: number) =>
        `<feDisplacementMap in="SourceGraphic" in2="m" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>`;
    const keep = (row: string, name: string) =>
        `<feColorMatrix type="matrix" values="${row} 0 0 0 1 0" result="${name}"/>`;

    return (
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg height="${h}" width="${w}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="displace" color-interpolation-filters="sRGB"><feImage x="0" y="0" width="${w}" height="${h}" href="${lgMap(h, w, r, d)}" result="m"/>${displace(s + ca * 2)}${keep('1 0 0 0 0 0 0 0 0 0 0 0 0 0 0', 'R')}${displace(s + ca)}${keep('0 0 0 0 0 0 1 0 0 0 0 0 0 0 0', 'G')}${displace(s)}${keep('0 0 0 0 0 0 0 0 0 0 0 0 1 0 0', 'B')}<feBlend in="R" in2="G" mode="screen"/><feBlend in2="B" mode="screen"/></filter></defs></svg>`,
        ) +
        '#displace'
    );
}

/**
 * Paints an abstract, hard-edged composition in the deck palette. The glass needs
 * crisp edges and strong colour contrast behind it to visibly refract.
 */
function paintBackdrop(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return;
    }

    const W = 1920;
    const H = 1080;
    let seed = 7;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;

        return seed / 2147483647;
    };
    const linear = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        stops: string[],
    ) => {
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        stops.forEach((color, i) =>
            gradient.addColorStop(i / (stops.length - 1), color),
        );

        return gradient;
    };
    const circle = (
        x: number,
        y: number,
        r: number,
        fill: string | CanvasGradient,
    ) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
    };

    const base = ctx.createRadialGradient(960, 300, 0, 960, 300, 1400);
    base.addColorStop(0, '#24473A');
    base.addColorStop(1, '#0B1A14');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    // Diagonal stripe field
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-0.5);

    for (let x = -1400; x < 1400; x += 56) {
        ctx.fillStyle = 'rgba(143,227,196,0.07)';
        ctx.fillRect(x, -1200, 18, 2400);
    }

    ctx.restore();

    // Large solid orbs
    circle(1460, 300, 330, linear(1130, 0, 1790, 630, ['#D4E03C', '#2EAA6E']));
    circle(380, 820, 290, linear(90, 530, 670, 1110, ['#8FE3C4', '#22969F']));
    circle(
        1050,
        980,
        210,
        linear(840, 770, 1260, 1190, ['#FFC58A', '#D4E03C']),
    );
    circle(260, 190, 120, linear(140, 70, 380, 310, ['#2EAA6E', '#0E3B2C']));

    // Concentric rings
    ctx.lineWidth = 22;

    [180, 250, 320].forEach((r, i) => {
        ctx.strokeStyle = ['#D4E03C', '#8FE3C4', '#FFC58A'][i];
        ctx.globalAlpha = 0.85 - i * 0.2;
        ctx.beginPath();
        ctx.arc(720, 380, r, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Bold wave band
    ctx.beginPath();
    ctx.moveTo(-50, 620);

    for (let x = -50; x <= W + 50; x += 20) {
        ctx.lineTo(x, 620 + Math.sin(x / 210) * 70);
    }

    ctx.lineTo(W + 50, 700);

    for (let x = W + 50; x >= -50; x -= 20) {
        ctx.lineTo(x, 700 + Math.sin(x / 210 + 0.6) * 70);
    }

    ctx.closePath();
    ctx.fillStyle = linear(0, 0, W, 0, ['#22969F', '#D4E03C', '#2EAA6E']);
    ctx.fill();

    // Dot grid
    ctx.fillStyle = 'rgba(244,247,239,0.55)';

    for (let y = 120; y < 420; y += 30) {
        for (let x = 1640; x < 1880; x += 30) {
            ctx.fillRect(x, y, 5, 5);
        }
    }

    // Grain
    for (let i = 0; i < 7000; i++) {
        ctx.fillStyle = `rgba(225,240,205,${0.03 + rand() * 0.12})`;
        ctx.fillRect(rand() * W, rand() * H, 1.4, 1.4);
    }

    const vignette = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.35,
        W / 2,
        H / 2,
        W * 0.75,
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
}
