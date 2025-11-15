"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import InfiniteGallery from "@/components/InfiniteGallery"
import { ParticleSphere } from "@/components/particle-sphere"
import Hero from "@/components/hero"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const sampleImages = [
    { src: "/dumbbell-curls-biceps-exercise.jpg", alt: "Dumbbell curls" },
    { src: "/barbell-squat-leg-exercise.jpg", alt: "Barbell squat" },
    { src: "/home-workout-bodyweight.jpg", alt: "Home workout" },
    { src: "/mass-building-workout-program.jpg", alt: "Mass building" },
    { src: "/plank-core-exercise.jpg", alt: "Plank core" },
    { src: "/pull-ups-back-exercise.jpg", alt: "Pull ups" },
    { src: "/push-ups-bodyweight-exercise.jpg", alt: "Push ups" },
    { src: "/deadlift-back-exercise.jpg", alt: "Deadlift" },
  ]

  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory pt-16 md:pt-20">
      <Navbar />
        <div className="w-full h-screen bg-black relative snap-start">
          <div className="absolute top-20 left-0 right-0 z-10 p-6">
            <h1 className="max-w-[750px] mx-auto text-white text-center font-instrument-serif px-6 md:text-6xl text-4xl tracking-tight font-normal">
              The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.
            </h1>
          </div>
          <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <ParticleSphere images={sampleImages.map((i) => i.src)} />
            <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />
          </Canvas>
        </div>

        {/* Smooth transition from black (first section) to white (second section) */}
        <div className="w-full h-24 bg-gradient-to-b from-black to-white" />

        <section className="relative h-screen bg-white snap-start">
          <InfiniteGallery
				images={sampleImages}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full rounded-lg overflow-hidden"
			/>
			<div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
				<h1 className="font-serif text-4xl md:text-7xl tracking-tight">
					<span className="italic">I create;</span> therefore I am
				</h1>
			</div>

			<div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
				<p>Use mouse wheel, arrow keys, or touch to navigate</p>
				<p className=" opacity-60">
					Auto-play resumes after 3 seconds of inactivity
				</p>
			</div>

          {/* Local help overlay for this section only */}
          <div className="absolute bottom-10 left-0 right-0 text-center font-mono uppercase text-[11px] font-semibold text-black/70">
            <p>Use mouse wheel, arrow keys, or touch to navigate</p>
            <p className="opacity-60">Auto-play resumes after 3 seconds of inactivity</p>
          </div>
        </section>

      <Hero />
      <footer className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm"> {new Date().getFullYear()} MuscleX. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="/exercises" className="hover:text-primary">Exercises</a>
            <a href="/workouts" className="hover:text-primary">Programs</a>
            <a href="/profile" className="hover:text-primary">Profile</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
