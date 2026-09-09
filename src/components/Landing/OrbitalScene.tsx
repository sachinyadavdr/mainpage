import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Euler, MathUtils, Matrix4, Mesh, Texture, TextureLoader, Vector3 } from 'three'

const EARTH_RADIUS = 1.55
const INDIA = { latitude: 20.5937, longitude: 78.9629 }
const EARTH_TEXTURE = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
const INDIA_POINT = latLongToPoint(INDIA.latitude, INDIA.longitude, EARTH_RADIUS + 0.12)
const INDIA_FACING_ROTATION_MATRIX = new Matrix4().makeRotationFromEuler(new Euler(0.04, -MathUtils.degToRad(INDIA.longitude), 0))
const INDIA_FACING_ROTATION = new Euler().setFromRotationMatrix(INDIA_FACING_ROTATION_MATRIX)

function latLongToPoint(latitude: number, longitude: number, radius: number) {
    const latitudeRadians = (latitude * Math.PI) / 180
    const longitudeRadians = (longitude * Math.PI) / 180
    return new Vector3(
        radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians),
        radius * Math.sin(latitudeRadians),
        radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
    )
}

function IndiaSignal() {
    const point = latLongToPoint(INDIA.latitude, INDIA.longitude, EARTH_RADIUS + 0.035)
    const pulse = useRef<Mesh>(null)

    useFrame(({ clock }) => {
        if (pulse.current) {
            const scale = 1 + Math.sin(clock.elapsedTime * 3.4) * 0.22
            pulse.current.scale.setScalar(scale)
        }
    })

    return <group position={point}>
        <mesh ref={pulse}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshBasicMaterial color="#5af0ae" transparent opacity={0.22} blending={AdditiveBlending} />
        </mesh>
        <mesh>
            <sphereGeometry args={[0.045, 20, 20]} />
            <meshBasicMaterial color="#c9ffe5" />
        </mesh>
    </group>
}

function OrbitTrail({ tilt, scale }: { tilt: number; scale: [number, number, number] }) {
    const points = Array.from({ length: 96 }, (_, index) => {
        const angle = (index / 95) * Math.PI * 2
        return new Vector3(Math.cos(angle) * 2.05, Math.sin(angle) * 2.05, 0)
    })
    const geometry = new BufferGeometry().setFromPoints(points)
    return <lineLoop rotation={[tilt, 0.18, 0.35]} scale={scale} geometry={geometry}>
        <lineBasicMaterial color="#43dca3" transparent opacity={0.22} blending={AdditiveBlending} />
    </lineLoop>
}

function Satellite() {
    const satellite = useRef<Mesh>(null)
    const beam = useRef<Mesh>(null)

    useFrame(({ clock }) => {
        const angle = clock.elapsedTime * 0.55
        const x = Math.cos(angle) * 1.25
        const z = Math.sin(angle) * 0.75
        const y = 1.9 + Math.sin(angle * 0.7) * 0.2
        if (satellite.current) {
            satellite.current.position.set(x, y, z)
            satellite.current.rotation.y = -angle + Math.PI / 2
        }
        if (beam.current) {
            const direction = INDIA_POINT.clone().sub(new Vector3(x, y, z))
            beam.current.position.set((x + INDIA_POINT.x) * 0.5, (y + INDIA_POINT.y) * 0.5, (z + INDIA_POINT.z) * 0.5)
            beam.current.scale.set(1, direction.length() / 1.65, 1)
            beam.current.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize())
        }
    })

    return <>
        <mesh ref={satellite}>
            <boxGeometry args={[0.22, 0.13, 0.16]} />
            <meshBasicMaterial color="#c7e6e5" />
            <mesh position={[0.27, 0, 0]}>
                <boxGeometry args={[0.32, 0.015, 0.16]} />
                <meshBasicMaterial color="#48b9c4" />
            </mesh>
            <mesh position={[-0.27, 0, 0]}>
                <boxGeometry args={[0.32, 0.015, 0.16]} />
                <meshBasicMaterial color="#48b9c4" />
            </mesh>
            <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
                <meshBasicMaterial color="#75f2b6" />
            </mesh>
        </mesh>
        <mesh ref={beam}>
            <coneGeometry args={[0.34, 1.65, 24, 1, true]} />
            <meshBasicMaterial color="#5af0ae" transparent opacity={0.09} side={2} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
    </>
}

function Starfield() {
    const geometry = new BufferGeometry()
    const positions = new Float32Array(720)
    for (let index = 0; index < positions.length; index += 3) {
        const radius = 5 + Math.random() * 6
        const angle = Math.random() * Math.PI * 2
        const height = (Math.random() - 0.5) * 8
        positions[index] = Math.cos(angle) * radius
        positions[index + 1] = height
        positions[index + 2] = Math.sin(angle) * radius
    }
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    return <points geometry={geometry}>
        <pointsMaterial color="#9bd8d0" size={0.018} transparent opacity={0.8} sizeAttenuation />
    </points>
}

function Scene({ earthTexture }: { earthTexture: Texture }) {
    const group = useRef<Mesh>(null)
    const mouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const onPointerMove = (event: PointerEvent) => {
            mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 0.12
            mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 0.08
        }
        window.addEventListener('pointermove', onPointerMove)
        return () => window.removeEventListener('pointermove', onPointerMove)
    }, [])

    useFrame((_, delta) => {
        if (!group.current) return
        group.current.rotation.y += delta * 0.045
        group.current.rotation.x += (mouse.current.y - group.current.rotation.x) * delta * 2.2
        group.current.rotation.z += (mouse.current.x - group.current.rotation.z) * delta * 2.2
    })

    return <group ref={group} rotation={INDIA_FACING_ROTATION}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 2, 5]} intensity={1.8} color="#d8fff1" />
        <mesh>
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <meshBasicMaterial map={earthTexture} color="#d4fff0" />
        </mesh>
        <mesh scale={1.012}>
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <meshBasicMaterial color="#2de19a" transparent opacity={0.045} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <IndiaSignal />
        <OrbitTrail tilt={0.9} scale={[1, 0.62, 1]} />
        <OrbitTrail tilt={-0.55} scale={[1, 0.48, 1]} />
        <Satellite />
        <Starfield />
    </group>
}

export function OrbitalScene() {
    const [isGlobeLoaded, setIsGlobeLoaded] = useState(false)
    const [earthTexture, setEarthTexture] = useState<Texture | null>(null)

    useEffect(() => {
        const loader = new TextureLoader()
        loader.load(EARTH_TEXTURE, (texture) => {
            setEarthTexture(texture)
            setIsGlobeLoaded(true)
        })
    }, [])

    return <div className={`orbital-scene ${isGlobeLoaded ? 'is-ready' : ''}`} style={{ opacity: isGlobeLoaded ? 0.96 : 0, transition: 'opacity 0.5s ease-in-out' }} aria-hidden="true">
        {!isGlobeLoaded && <div className="orbital-loader"><span /><small>CALIBRATING INDIA VIEW</small></div>}
        <Canvas camera={{ position: [0, 0, 5.8], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}>
            {earthTexture && <Scene earthTexture={earthTexture} />}
        </Canvas>
    </div>
}
