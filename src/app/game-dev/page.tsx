    'use client';

    import React, { useEffect, useMemo, useState } from 'react';
    import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
    import Link from 'next/link';
    import { GITHUB_URL, LINKEDIN_URL, SITE_EMAIL } from '../../config/site';

    /*
    * ART DIRECTION
    * -------------
    * ART DIRECTION
    * -------------
    * Theme: "A game developer's wall of ideas at 2AM"
    *
    * This is intentionally NOT a generic cyberpunk dashboard.
    * The composition behaves more like an editorial poster / game concept sheet:
    * oversized typography, asymmetry, negative space, cropped geometry, handwritten
    * notes, material-like panels, controlled color blocking and visual tension.
    *
    * The UI is the frame. The work is the artwork.
    */

    type MenuId = 'profile' | 'skills' | 'projects' | 'contact';

    type MenuItem = {
        id: MenuId;
        label: string;
        icon: string;
        code: string;
    };

    type Skill = {
        name: string;
        level: number;
        category: string;
        color: string;
    };

    type Project = {
        name: string;
        status: 'COMPLETED' | 'IN DEVELOPMENT' | 'PROTOTYPE';
        description: string;
        tech: string[];
        gradient: string;
        number: string;
    };

    const menuItems: MenuItem[] = [
        { id: 'profile', label: 'PROFILE', icon: '◈', code: '01' },
        { id: 'skills', label: 'SKILLS', icon: '◇', code: '02' },
        { id: 'projects', label: 'PROJECTS', icon: '▣', code: '03' },
        { id: 'contact', label: 'CONTACT', icon: '⌁', code: '04' },
    ];

    const profileStats = [
        { label: 'LEVEL', value: '20', sub: 'DEV_RANK', accent: 'yellow' },
        { label: 'STREET CRED', value: 'BEGINNER', sub: 'FIELD_EXP', accent: 'cyan' },
        { label: 'REPUTATION', value: 'NOOB', sub: 'STATUS_FLAG', accent: 'pink' },
    ];

    const skillsData: Skill[] = [
        { name: 'UNITY 3D', level: 95, category: 'ENGINE', color: 'from-cyan-300 to-blue-500' },
        { name: 'UNREAL ENGINE', level: 88, category: 'ENGINE', color: 'from-violet-400 to-fuchsia-500' },
        { name: 'C# SCRIPTING', level: 92, category: 'CODE', color: 'from-emerald-300 to-green-500' },
        { name: 'BLENDER', level: 85, category: 'ART', color: 'from-orange-300 to-red-500' },
        { name: 'GAME DESIGN', level: 90, category: 'DESIGN', color: 'from-yellow-300 to-amber-500' },
        { name: 'VR / AR', level: 78, category: 'TECH', color: 'from-blue-400 to-indigo-500' },
    ];

    const projectsData: Project[] = [
        {
            name: 'CYBER RUNNER',
            status: 'COMPLETED',
            description:
                'Fast-paced 3D endless runner with procedural environments, reactive neon materials and a deliberately aggressive visual language.',
            tech: ['UNITY', 'C#', 'SHADER GRAPH'],
            gradient: 'from-cyan-400 via-blue-600 to-fuchsia-500',
            number: '001',
        },
        {
            name: 'MYSTIC REALMS',
            status: 'IN DEVELOPMENT',
            description:
                'Open-world RPG prototype combining dynamic weather, AI-driven NPC behaviour and large-scale Unreal Engine 5 environments.',
            tech: ['UE5', 'BLUEPRINT', 'C++'],
            gradient: 'from-violet-500 via-purple-700 to-pink-500',
            number: '002',
        },
        {
            name: 'VR SPACE STATION',
            status: 'PROTOTYPE',
            description:
                'Immersive VR environment built around zero-gravity interaction, spatial navigation and tactile futuristic interfaces.',
            tech: ['UNITY XR', 'OCULUS SDK', 'C#'],
            gradient: 'from-blue-500 via-cyan-500 to-emerald-400',
            number: '003',
        },
    ];

    function createArtifacts(count = 12) {
        return Array.from({ length: count }, (_, index) => ({
            id: index,
            left: (index * 37 + 11) % 100,
            top: (index * 61 + 19) % 100,
            width: 1 + (index % 3) * 0.5,
            height: 8 + ((index * 13) % 23),
            delay: ((index * 7) % 60) / 10,
            duration: 3 + (index % 4),
        }));
    }


    const artNotes = [
        'MAKE IT FEEL PLAYABLE',
        'LIGHT / MOTION / WEIGHT',
        'BUILD THE FEEL FIRST',
    ];

    function CursorGlow() {
        const [cursor, setCursor] = useState({ x: 50, y: 50 });

        useEffect(() => {
            let frame: number | null = null;
            let clientX = 0;
            let clientY = 0;

            const move = (event: MouseEvent) => {
                clientX = event.clientX;
                clientY = event.clientY;

                if (frame !== null) return;

                frame = window.requestAnimationFrame(() => {
                    frame = null;
                    setCursor({
                        x: (clientX / window.innerWidth) * 100,
                        y: (clientY / window.innerHeight) * 100,
                    });
                });
            };

            window.addEventListener('mousemove', move);
            return () => {
                window.removeEventListener('mousemove', move);
                if (frame !== null) window.cancelAnimationFrame(frame);
            };
        }, []);

        return (
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
                style={{
                    background: `
                        radial-gradient(circle 620px at ${cursor.x}% ${cursor.y}%,
                            rgba(0,229,255,0.11),
                            transparent 62%),
                        radial-gradient(circle 520px at 78% 18%,
                            rgba(255,32,128,0.08),
                            transparent 65%),
                        radial-gradient(circle 700px at 18% 88%,
                            rgba(250,204,21,0.055),
                            transparent 68%)
                    `,
                }}
            />
        );
    }

    export default function GameDevPage() {
        const [activeMenu, setActiveMenu] = useState<MenuId>('profile');
        const [glitchActive, setGlitchActive] = useState(false);
        const [clock, setClock] = useState('');
        const [booted, setBooted] = useState(false);
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const shouldReduceMotion = useReducedMotion();

        const artifacts = useMemo(() => createArtifacts(), []);

        useEffect(() => {
            const timer = window.setTimeout(() => setBooted(true), 450);

            const updateClock = () => {
                setClock(
                    new Intl.DateTimeFormat(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }).format(new Date())
                );
            };

            updateClock();
            const clockTimer = window.setInterval(updateClock, 1000);

            return () => {
                window.clearTimeout(timer);
                window.clearInterval(clockTimer);
            };
        }, []);

        useEffect(() => {
            if (shouldReduceMotion) return;

            const glitchTimer = window.setInterval(() => {
                if (Math.random() > 0.7) {
                    setGlitchActive(true);
                    window.setTimeout(() => setGlitchActive(false), 110);
                }
            }, 2800);

            return () => window.clearInterval(glitchTimer);
        }, [shouldReduceMotion]);

        const selectMenu = (id: MenuId) => {
            setActiveMenu(id);
            setMobileMenuOpen(false);
        };

        return (
            <div className={`game-dev-page cyberpunk-font min-h-screen overflow-hidden bg-[#050608] text-white ${booted ? 'boot-complete' : 'booting'}`}>
                {/* =========================================================
                    ATMOSPHERE
                ========================================================= */}

                <div className="pointer-events-none fixed inset-0 z-0 bg-[#070708]" />

                {/* A moving pool of light gives the page the feeling of a physical space,
                    not a flat software canvas. */}
                <CursorGlow />

                {/* Editorial registration marks */}
                <div className="pointer-events-none fixed inset-0 z-0">
                    <div className="absolute left-[6vw] top-0 h-full w-px bg-white/[0.055]" />
                    <div className="absolute right-[6vw] top-0 h-full w-px bg-white/[0.055]" />
                    <div className="absolute left-[6vw] top-[20vh] h-px w-[88vw] bg-white/[0.035]" />
                    <div className="absolute left-[6vw] bottom-[11vh] h-px w-[88vw] bg-white/[0.035]" />
                </div>

                {/* Grain + scan texture */}
                <div className="pointer-events-none fixed inset-0 z-[2] opacity-[0.075] mix-blend-screen [background-image:radial-gradient(rgba(255,255,255,.8)_0.55px,transparent_.55px)] [background-size:5px_5px]" />
                <div className="pointer-events-none fixed inset-0 z-[2] opacity-[0.035] [background-image:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,.7)_4px)]" />

                {/* Oversized ghost type: an art-direction layer rather than decoration. */}
                <div className="pointer-events-none fixed -right-20 top-[28vh] z-0 select-none font-black text-[17vw] leading-none tracking-[-0.1em] text-white/[0.018]">
                    PLAY
                </div>

                {!shouldReduceMotion && (
                    <div className="pointer-events-none fixed inset-0 z-0">
                        {artifacts.map((artifact) => (
                            <motion.div
                                key={artifact.id}
                                className="absolute bg-cyan-300/20"
                                style={{
                                    left: `${artifact.left}%`,
                                    top: `${artifact.top}%`,
                                    width: artifact.width,
                                    height: artifact.height,
                                }}
                                animate={{ y: [0, -80, 0], opacity: [0, 0.4, 0] }}
                                transition={{
                                    duration: artifact.duration,
                                    delay: artifact.delay,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* =========================================================
                    TOP SYSTEM STRIP
                ========================================================= */}

                <div className="relative z-50 flex h-7 items-center justify-between border-b border-cyan-400/20 bg-black/80 px-4 font-mono text-[9px] tracking-[0.25em] text-cyan-400/60 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">NIGHT_CITY // DEV_NODE_07</span>
                        <span className="sm:hidden">DEV_NODE_07</span>
                        <span className="text-white/20">///</span>
                        <span className="text-yellow-400/70">SECURE</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">SYS.STATUS</span>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                        <span>ONLINE</span>
                    </div>
                </div>

                {/* =========================================================
                    MAIN SHELL
                ========================================================= */}

                <div id="main-content" className="relative z-10 flex min-h-[calc(100vh-28px)] flex-col lg:flex-row">
                    {/* =====================================================
                        SIDEBAR
                    ===================================================== */}

                    <aside className="relative shrink-0 border-b border-cyan-400/20 bg-[#07090c]/90 backdrop-blur-xl lg:min-h-[calc(100vh-28px)] lg:w-[310px] lg:border-b-0 lg:border-r">
                        <div className="absolute right-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent lg:block" />

                        <div className="p-5 sm:p-7 lg:p-8">
                            {/* Brand */}
                            <div className="relative mb-6 sm:mb-10">
                                <div className="mb-5 flex items-center justify-between font-mono text-[8px] tracking-[0.32em] text-white/25">
                                    <span>MUHAMMAD BASIL / 2026</span>
                                    <span>01—04</span>
                                </div>

                                <div className="relative overflow-visible">
                                    <div className="absolute -left-3 top-1 h-28 w-[3px] bg-yellow-400" />

                                    <div className="mb-3 pl-3 font-mono text-[8px] tracking-[0.4em] text-cyan-300/60">
                                        GAME DEVELOPER / DIGITAL WORLDS
                                    </div>

                                    <h1 className="relative pl-3 text-[48px] font-black uppercase leading-[0.76] tracking-[-0.09em] text-white sm:text-[58px]">
                                        MAKE
                                        <br />
                                        <span className="relative inline-block text-yellow-400">
                                            WORLDS
                                            <span className="absolute -bottom-1 left-0 h-[5px] w-[70%] -skew-x-12 bg-pink-500" />
                                        </span>
                                    </h1>

                                    <p className="mt-5 max-w-[205px] pl-3 font-mono text-[9px] uppercase leading-5 tracking-[0.18em] text-white/35">
                                        Games are spaces people remember. I build the systems that make those spaces feel alive.
                                    </p>

                                    {glitchActive && (
                                        <div className="pointer-events-none absolute -left-1 top-8 translate-x-[4px] select-none text-[48px] font-black leading-[0.76] tracking-[-0.09em] text-cyan-400/35 sm:text-[58px]">
                                            MAKE
                                            <br />
                                            WORLDS
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile menu */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((value) => !value)}
                                aria-expanded={mobileMenuOpen}
                                className="mb-3 flex w-full items-center justify-between border border-cyan-400/20 bg-cyan-400/[0.03] px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-cyan-300 lg:hidden"
                            >
                                <span>NAVIGATION // {activeMenu.toUpperCase()}</span>
                                <span>{mobileMenuOpen ? '▲' : '▼'}</span>
                            </button>

                            {/* Navigation */}
                            <nav
                                className={`${mobileMenuOpen ? 'block' : 'hidden'} space-y-1 lg:block`}
                                aria-label="Main navigation"
                            >
                                <div className="mb-3 hidden font-mono text-[8px] uppercase tracking-[0.35em] text-white/20 lg:block">
                                    Turn the page →
                                </div>

                                {menuItems.map((item) => {
                                    const active = activeMenu === item.id;
                                    const animationProps = shouldReduceMotion ? {} : { whileHover: { x: 5 }, whileTap: { scale: 0.985 } };

                                    return (
                                        <motion.button
                                            key={item.id}
                                            type="button"
                                            onClick={() => selectMenu(item.id)}
                                            {...animationProps}
                                            className={`group relative flex w-full items-center overflow-hidden border-l-2 px-3 py-4 text-left transition-all ${
                                                active
                                                    ? 'border-yellow-400 bg-yellow-400/[0.07]'
                                                    : 'border-transparent hover:border-cyan-400/50 hover:bg-white/[0.025]'
                                            }`}
                                            aria-current={active ? 'page' : undefined}
                                        >
                                            {active && (
                                                <motion.div
                                                    layoutId="nav-line"
                                                    className="absolute right-0 top-0 h-full w-px bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                                                />
                                            )}

                                            <span
                                                className={`mr-4 font-mono text-[10px] ${
                                                    active ? 'text-yellow-400' : 'text-white/25'
                                                }`}
                                            >
                                                {item.code}
                                            </span>

                                            <span
                                                className={`mr-3 text-base ${
                                                    active ? 'text-cyan-300' : 'text-white/30 group-hover:text-cyan-300'
                                                }`}
                                            >
                                                {item.icon}
                                            </span>

                                            <span
                                                className={`font-mono text-xs font-bold tracking-[0.22em] ${
                                                    active ? 'text-white' : 'text-white/45 group-hover:text-white'
                                                }`}
                                            >
                                                {item.label}
                                            </span>

                                            <span className="ml-auto font-mono text-[8px] text-white/15">
                                                {active ? 'ACTIVE' : 'OPEN'}
                                            </span>
                                        </motion.button>
                                    );
                                })}

                                <div className="my-5 h-px bg-white/[0.06]" />

                                <Link href="/" className="group block">
                                    <div className="relative flex items-center border border-red-500/20 bg-red-500/[0.025] px-4 py-4 transition-all hover:border-red-500/50 hover:bg-red-500/[0.06]">
                                        <span className="mr-4 font-mono text-[10px] text-red-500/40">XX</span>
                                        <span className="font-mono text-xs font-bold tracking-[0.2em] text-red-400">
                                            SYSTEM EXIT
                                        </span>
                                        <span className="ml-auto text-red-500">⏻</span>
                                    </div>
                                </Link>
                            </nav>
                        </div>

                        {/* Sidebar technical footer */}
                        <div className="border-t border-white/[0.07] bg-black/40 p-5 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                            <div className="mb-3 flex items-center justify-between font-mono text-[8px] tracking-[0.25em] text-white/25">
                                <span>CONNECTION</span>
                                <span>100%</span>
                            </div>

                            <div className="mb-4 flex gap-[2px]">
                                {Array.from({ length: 18 }).map((_, index) => (
                                    <span
                                        key={index}
                                        className={`h-1 flex-1 ${
                                            index < 16 ? 'bg-cyan-400/50' : 'bg-white/10'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between font-mono text-[9px] text-white/30">
                                <span>BUILD 2.0.77</span>
                                <span>© 2026</span>
                            </div>
                        </div>
                    </aside>

                    {/* =====================================================
                        CONTENT
                    ===================================================== */}

                    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                        {/* Header */}
                        <header className="relative z-20 flex min-h-[82px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-black/40 px-5 backdrop-blur-md sm:px-8">
                            <div className="min-w-0">
                                <div className="mb-1 font-mono text-[8px] tracking-[0.4em] text-cyan-400/50">
                                    OPERATOR_ID
                                </div>
                                <div className="truncate font-mono text-sm font-bold tracking-[0.12em] text-white sm:text-base">
                                    MUHAMMAD BASIL C.P
                                </div>
                            </div>

                            <div className="hidden items-center gap-4 sm:flex">
                                <div className="text-right font-mono">
                                    <div className="text-[8px] tracking-[0.3em] text-white/25">LOCAL_TIME</div>
                                    <div className="text-xs text-cyan-300">{clock || '--:--:--'}</div>
                                </div>

                                <div className="h-8 w-px bg-white/10" />

                                <div className="border border-yellow-400/30 bg-yellow-400/[0.05] px-3 py-2 font-mono text-[9px] font-bold tracking-[0.25em] text-yellow-400">
                                    GAME_DEV
                                </div>
                            </div>
                        </header>

                        {/* Content viewport */}
                        <div className="relative flex-1 overflow-y-auto">
                            {/* Architectural decoration */}
                            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 border-l border-b border-cyan-400/[0.08]" />
                            <div className="pointer-events-none absolute right-8 top-8 hidden font-mono text-[8px] tracking-[0.35em] text-cyan-400/20 md:block">
                                10.24.77 // SECURE
                            </div>

                            <div className="pointer-events-none absolute bottom-8 left-8 hidden font-mono text-[8px] tracking-[0.35em] text-white/15 md:block">
                                NODE_07 / CREATIVE_DIVISION
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMenu}
                                    initial={
                                        shouldReduceMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, y: 20, filter: 'blur(7px)' }
                                    }
                                    animate={
                                        shouldReduceMotion
                                            ? { opacity: 1 }
                                            : { opacity: 1, y: 0, filter: 'blur(0px)' }
                                    }
                                    exit={
                                        shouldReduceMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, y: -15, filter: 'blur(7px)' }
                                    }
                                    transition={{ duration: 0.35 }}
                                    className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-12"
                                >
                                    {activeMenu === 'profile' && <ProfileContent />}
                                    {activeMenu === 'skills' && <SkillsContent />}
                                    {activeMenu === 'projects' && <ProjectsContent />}
                                    {activeMenu === 'contact' && <ContactContent />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>

                {/* Glitch layer */}
                <AnimatePresence>
                    {glitchActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
                        >
                            <div className="absolute left-0 top-[42%] h-2 w-full bg-red-500/20 mix-blend-screen" />
                            <div className="absolute left-0 top-[58%] h-px w-full bg-cyan-400/40 mix-blend-screen" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    /* ================================================================
    PROFILE
    ================================================================ */

    function ProfileContent() {
        return (
            <section aria-labelledby="profile-title">
                <PageIntro
                    number="01"
                    eyebrow="IDENTITY / PLAYER DATA"
                    title="PROFILE_DATA"
                    description="A developer interface built around the idea that a portfolio should feel like an artifact from the world it represents."
                    accent="yellow"
                />

                {/* Hero panel */}
                <div className="relative mt-8 overflow-hidden border border-white/[0.09] bg-[#0b0b0c]">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-cyan-300/10" />
                    <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-pink-400/10" />
                    <div className="absolute left-0 top-0 h-full w-[5px] bg-yellow-400" />

                    <div className="relative grid lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="p-6 sm:p-8 lg:p-10">
                            <div className="mb-6 flex items-center gap-3 font-mono text-[9px] tracking-[0.35em] text-cyan-400/50">
                                <span className="h-px w-8 bg-cyan-400/40" />
                                BIO_LOG // 2077
                            </div>

                            <div className="relative">
                                <div className="absolute -left-2 top-1 text-[70px] font-black leading-none text-white/[0.025] sm:text-[110px]">
                                    02
                                </div>

                                <h3 className="relative max-w-3xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.065em] text-white sm:text-6xl">
                                    I LIKE
                                    <br />
                                    <span className="text-cyan-300">SYSTEMS</span>
                                    <br />
                                    WITH A
                                    <br />
                                    <span className="text-yellow-400">SOUL.</span>
                                </h3>
                            </div>

                            <p className="mt-8 max-w-2xl text-[15px] leading-7 text-white/45 sm:text-base">
                                I am interested in the tiny things that make a game feel physical:
                                the weight of a movement, the timing of a sound, the colour of a room,
                                the strange little interaction a player remembers hours later.
                            </p>

                            <div className="mt-7 border-l-2 border-pink-500/60 pl-4 font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-pink-300/45">
                                Design instinct // technical curiosity // obsessive iteration
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 max-w-md">
                                {artNotes.map((note, index) => (
                                    <div
                                        key={note}
                                        className={`font-mono text-[8px] uppercase tracking-[0.13em] ${
                                            index === 1 ? 'rotate-[-2deg] text-yellow-400/45' : 'text-white/30'
                                        }`}
                                    >
                                        <span className="mr-2 text-cyan-400/50">0{index + 1}</span>
                                        {note}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Diagnostic panel */}
                        <div className="border-t border-white/[0.07] bg-black/20 p-6 lg:border-l lg:border-t-0">
                            <div className="mb-6 font-mono text-[9px] tracking-[0.35em] text-white/25">
                                DIAGNOSTICS
                            </div>

                            <Diagnostic label="CREATIVE" value="92%" />
                            <Diagnostic label="SYSTEMS" value="87%" />
                            <Diagnostic label="3D_PIPELINE" value="90%" />
                            <Diagnostic label="PROBLEM_SOLVING" value="94%" />

                            <div className="mt-8 border-t border-white/[0.06] pt-5 font-mono text-[9px] leading-5 text-white/25">
                                <div>NODE: ACTIVE</div>
                                <div>MODE: BUILD</div>
                                <div>ACCESS: PUBLIC</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-1 gap-px bg-white/[0.07] sm:grid-cols-3">
                    {profileStats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="relative bg-[#080b0e] p-6 sm:p-7"
                        >
                            <div
                                className={`absolute left-0 top-0 h-px w-12 ${
                                    stat.accent === 'yellow'
                                        ? 'bg-yellow-400'
                                        : stat.accent === 'pink'
                                        ? 'bg-pink-400'
                                        : 'bg-cyan-400'
                                }`}
                            />

                            <div className="mb-2 font-mono text-[9px] tracking-[0.25em] text-white/30">
                                {stat.sub}
                            </div>

                            <div className="font-mono text-[9px] tracking-[0.2em] text-white/45">
                                {stat.label}
                            </div>

                            <div
                                className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${
                                    stat.accent === 'yellow'
                                        ? 'text-yellow-400'
                                        : stat.accent === 'pink'
                                        ? 'text-pink-400'
                                        : 'text-cyan-400'
                                }`}
                            >
                                {stat.value}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        );
    }

    /* ================================================================
    SKILLS
    ================================================================ */

    function SkillsContent() {
        return (
            <section aria-labelledby="skills-title">
                <PageIntro
                    number="02"
                    eyebrow="CAPABILITIES / LOADOUT"
                    title="SKILL_MATRIX"
                    description="The tools and systems currently loaded into the development stack."
                    accent="cyan"
                />

                <div className="mt-8 grid gap-px bg-white/[0.07] md:grid-cols-2">
                    {skillsData.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                            className="group relative overflow-hidden bg-[#080b0e] p-6 sm:p-7"
                        >
                            <div className="absolute right-0 top-0 h-16 w-16 border-l border-b border-white/[0.06]" />

                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <div className="mb-1 font-mono text-[9px] tracking-[0.3em] text-white/25">
                                        MODULE_{String(index + 1).padStart(2, '0')}
                                    </div>
                                    <h3 className="font-mono text-sm font-bold tracking-[0.15em] text-white sm:text-base">
                                        {skill.name}
                                    </h3>
                                </div>

                                <span className="border border-white/10 px-2 py-1 font-mono text-[8px] tracking-[0.15em] text-white/30">
                                    {skill.category}
                                </span>
                            </div>

                            <div className="relative h-3 border border-white/10 bg-black">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.2 + index * 0.08 }}
                                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${skill.color}`}
                                />

                                <div className="absolute inset-0 flex justify-between px-1">
                                    {Array.from({ length: 10 }).map((_, tick) => (
                                        <span key={tick} className="h-full w-px bg-black/40" />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 flex items-end justify-between">
                                <div className="font-mono text-[8px] tracking-[0.25em] text-white/20">
                                    SYNCHRONIZATION
                                </div>
                                <div className="font-mono text-sm font-bold text-cyan-300">
                                    {skill.level}%
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-5 border border-yellow-400/20 bg-yellow-400/[0.025] p-5 font-mono text-[9px] leading-6 tracking-[0.12em] text-yellow-400/50">
                    <span className="text-yellow-400">SYSTEM_NOTE //</span> Skill values represent
                    current confidence and practical familiarity, not a claim of absolute mastery.
                </div>
            </section>
        );
    }

    /* ================================================================
    PROJECTS
    ================================================================ */

    function ProjectsContent() {
        return (
            <section aria-labelledby="projects-title">
                <PageIntro
                    number="03"
                    eyebrow="ARCHIVE / SELECTED BUILDS"
                    title="PROJECT_DB"
                    description="A selection of game development experiments, prototypes and worlds."
                    accent="pink"
                />

                <div className="mt-8 space-y-5">
                    {projectsData.map((project, index) => (
                        <motion.article
                            key={project.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="group relative overflow-hidden border border-white/10 bg-[#080b0e]"
                        >
                            {/* Project visual */}
                            <div className="grid lg:grid-cols-[280px_1fr]">
                                <div
                                    className={`relative min-h-[245px] overflow-hidden bg-gradient-to-br ${project.gradient}`}
                                >
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_47%,transparent_48%)]" />
                                    <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[30px] border-white/[0.08]" />
                                    <div className="absolute right-[-60px] top-[-60px] h-56 w-56 rotate-12 border border-white/20" />
                                    <div className="absolute right-5 top-8 h-20 w-20 border-r border-t border-white/30" />

                                    <div className="absolute left-6 top-6 font-mono text-[8px] tracking-[0.35em] text-white/60">
                                        FIELD NOTE / {project.number}
                                    </div>

                                    <div className="absolute bottom-6 left-6 max-w-[85%]">
                                        <div className="mb-1 font-mono text-[8px] uppercase tracking-[0.35em] text-white/45">
                                            A SMALL WORLD IN PROGRESS
                                        </div>
                                        <div className="text-5xl font-black uppercase leading-[0.8] tracking-[-0.08em] text-white sm:text-6xl">
                                            {project.name.split(' ')[0]}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-5 right-5 rotate-90 font-mono text-[8px] tracking-[0.3em] text-white/40">
                                        2026 / BUILD
                                    </div>
                                </div>

                                {/* Project data */}
                                <div className="relative p-6 sm:p-8 lg:p-10">
                                    <div className="absolute right-0 top-0 h-14 w-14 border-l border-b border-white/[0.06]" />

                                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="mb-1 font-mono text-[8px] tracking-[0.35em] text-cyan-400/40">
                                                ARCHIVE ENTRY // {project.number}
                                            </div>
                                            <h3 className="text-2xl font-black tracking-[-0.03em] text-white transition-colors group-hover:text-cyan-300 sm:text-3xl">
                                                {project.name}
                                            </h3>
                                        </div>

                                        <StatusBadge status={project.status} />
                                    </div>

                                    <p className="max-w-3xl text-sm leading-7 text-white/45">
                                        {project.description}
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {project.tech.map((technology) => (
                                            <span
                                                key={technology}
                                                className="border border-cyan-400/15 bg-cyan-400/[0.025] px-3 py-1.5 font-mono text-[9px] tracking-[0.15em] text-cyan-300/60 transition-colors group-hover:border-cyan-400/30 group-hover:text-cyan-300"
                                            >
                                                {technology}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-7 flex items-center gap-3 font-mono text-[8px] tracking-[0.25em] text-white/20">
                                        <span className="h-px w-10 bg-white/10" />
                                        SYSTEM ARCHIVED
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        );
    }

    /* ================================================================
    CONTACT
    ================================================================ */

    function ContactContent() {
        const contacts = [
            {
                title: 'EMAIL',
                value: SITE_EMAIL,
                href: `mailto:${SITE_EMAIL}`,
                accent: 'cyan',
                code: 'MAIL_01',
            },
            {
                title: 'LINKEDIN',
                value: 'Connect Network',
                href: LINKEDIN_URL,
                accent: 'blue',
                code: 'NET_02',
            },
            {
                title: 'GITHUB',
                value: 'Source Codes',
                href: GITHUB_URL,
                accent: 'pink',
                code: 'SRC_03',
            },
        ];

        return (
            <section aria-labelledby="contact-title">
                <PageIntro
                    number="04"
                    eyebrow="COMMUNICATIONS / OPEN CHANNEL"
                    title="COMMS_LINK"
                    description="For collaborations, development work and interesting projects."
                    accent="green"
                />

                <div className="relative mt-8 grid gap-4 md:grid-cols-2">
                    {contacts.map((item, index) => (
                        <motion.a
                            key={item.title}
                            href={item.href}
                            target={item.title === 'EMAIL' ? undefined : '_blank'}
                            rel={item.title === 'EMAIL' ? undefined : 'noopener noreferrer'}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="group relative overflow-hidden border border-white/10 bg-[#080b0e] p-6 transition-all hover:border-cyan-400/40 sm:p-8"
                        >
                            <div className="absolute right-0 top-0 h-20 w-20 border-l border-b border-white/[0.06]" />

                            <div className="mb-7 flex items-center justify-between">
                                <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-400/40">
                                    {item.code}
                                </span>
                                <span className="text-white/20 transition-colors group-hover:text-cyan-300">
                                    ↗
                                </span>
                            </div>

                            <div className="mb-2 font-mono text-[9px] tracking-[0.3em] text-white/30">
                                {item.title}
                            </div>

                            <div className="break-all text-lg font-bold tracking-tight text-white transition-colors group-hover:text-cyan-300 sm:text-xl">
                                {item.value}
                            </div>

                            <div className="mt-7 h-px w-10 bg-cyan-400/40 transition-all duration-500 group-hover:w-full" />
                        </motion.a>
                    ))}

                    {/* Availability panel */}
                    <div className="relative overflow-hidden border border-green-400/25 bg-green-400/[0.025] p-6 sm:p-8">
                        <div className="absolute right-0 top-0 h-24 w-24 border-l border-b border-green-400/10" />

                        <div className="mb-8 flex items-center justify-between">
                            <span className="font-mono text-[9px] tracking-[0.3em] text-green-400/50">
                                CONNECTION_STATUS
                            </span>
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-[0_0_12px_#4ade80]" />
                        </div>

                        <div className="text-2xl font-black tracking-[-0.03em] text-green-400">
                            CHANNEL OPEN
                        </div>

                        <p className="mt-3 max-w-md font-mono text-[10px] leading-6 tracking-[0.1em] text-green-400/40">
                            AVAILABLE FOR CONTRACTS / COLLABORATIONS / GAME DEVELOPMENT WORK
                        </p>

                        <div className="mt-8 flex gap-1">
                            {Array.from({ length: 24 }).map((_, index) => (
                                <span key={index} className="h-1 flex-1 bg-green-400/30" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* ================================================================
    SHARED COMPONENTS
    ================================================================ */

    function PageIntro({
        number,
        eyebrow,
        title,
        description,
        accent,
    }: {
        number: string;
        eyebrow: string;
        title: string;
        description: string;
        accent: 'yellow' | 'cyan' | 'pink' | 'green';
    }) {
        const accents = {
            yellow: 'text-yellow-400',
            cyan: 'text-cyan-400',
            pink: 'text-pink-400',
            green: 'text-green-400',
        };

        const lines = {
            yellow: 'bg-yellow-400',
            cyan: 'bg-cyan-400',
            pink: 'bg-pink-400',
            green: 'bg-green-400',
        };

        return (
            <header className="relative">
                <div className="mb-4 flex items-center gap-3 font-mono text-[9px] tracking-[0.35em] text-white/25">
                    <span className={`h-px w-8 ${lines[accent]}`} />
                    {eyebrow}
                </div>

                <div className="relative flex items-end gap-4">
                    <span className="absolute -left-2 -top-8 select-none font-black text-[110px] leading-none tracking-[-0.1em] text-white/[0.025] sm:text-[150px]">
                        {number}
                    </span>

                    <span className={`relative z-10 font-mono text-4xl font-black sm:text-5xl ${accents[accent]}`}>
                        {number}
                    </span>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase tracking-[-0.07em] text-white sm:text-7xl">
                            {title}
                        </h2>
                    </div>
                </div>

                <p className="mt-5 max-w-2xl border-l border-white/10 pl-4 text-sm leading-6 text-white/35 sm:text-base">
                    {description}
                </p>
            </header>
        );
    }

    function Diagnostic({ label, value }: { label: string; value: string }) {
        return (
            <div className="mb-5">
                <div className="mb-2 flex justify-between font-mono text-[8px] tracking-[0.2em]">
                    <span className="text-white/30">{label}</span>
                    <span className="text-cyan-400/50">{value}</span>
                </div>

                <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <span
                            key={index}
                            className={`h-1 flex-1 ${
                                index < Math.round(parseInt(value) / 5)
                                    ? 'bg-cyan-400/50'
                                    : 'bg-white/[0.05]'
                            }`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    function StatusBadge({ status }: { status: Project['status'] }) {
        const styles = {
            COMPLETED: 'border-green-400/30 bg-green-400/[0.05] text-green-400',
            'IN DEVELOPMENT': 'border-yellow-400/30 bg-yellow-400/[0.05] text-yellow-400',
            PROTOTYPE: 'border-blue-400/30 bg-blue-400/[0.05] text-blue-400',
        };

        return (
            <span
                className={`border px-3 py-2 font-mono text-[8px] font-bold tracking-[0.15em] ${styles[status]}`}
            >
                {status}
            </span>
        );
    }
