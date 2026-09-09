import { Html, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { AdditiveBlending, BufferGeometry, Color, MathUtils, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import type { LineSegments, Mesh, PerspectiveCamera as PerspectiveCameraType } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const EARTH_RADIUS = 1.5
const EARTH_TEXTURE = '/assets/earth-daymap-2048.jpg'

const KANPUR = { latitude: 26.4499, longitude: 80.3319 }
const TEXTURE_LONGITUDE_OFFSET = 0
const LOCATION_LONGITUDE_OFFSET = -55
const KANPUR_FACING_ROTATION = -MathUtils.degToRad(KANPUR.longitude + TEXTURE_LONGITUDE_OFFSET)

function latLongToPoint(latitude: number, longitude: number, radius: number) {
    const latitudeRadians = (latitude * Math.PI) / 180
    const longitudeRadians = (longitude * Math.PI) / 180
    return new Vector3(
        radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians),
        radius * Math.sin(latitudeRadians),
        radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
    )
}

function LocationMarker() {
    const pulse = useRef<Mesh>(null)
    const leaderLine = useRef<LineSegments>(null)
    const markerLongitude = KANPUR.longitude + LOCATION_LONGITUDE_OFFSET
    const markerPoint = latLongToPoint(KANPUR.latitude, markerLongitude, EARTH_RADIUS + 0.045)
    const labelPoint = latLongToPoint(KANPUR.latitude, markerLongitude, EARTH_RADIUS + 0.32)
    const leaderGeometry = useRef(new BufferGeometry().setFromPoints([markerPoint, labelPoint])).current

    useFrame(({ clock }) => {
        if (pulse.current) {
            const scale = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.28
            pulse.current.scale.setScalar(scale)
        }
        if (leaderLine.current) {
            const geometry = leaderLine.current.geometry
            const positions = geometry.getAttribute('position')
            if (positions && positions.count === 2 && Number.isFinite(markerPoint.x) && Number.isFinite(labelPoint.x)) {
                positions.setXYZ(0, markerPoint.x, markerPoint.y, markerPoint.z)
                positions.setXYZ(1, labelPoint.x, labelPoint.y, labelPoint.z)
                positions.needsUpdate = true
            }
        }
    })

    return <group>
        <mesh ref={pulse} position={markerPoint}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshBasicMaterial color="#ff3b4f" transparent opacity={0.26} blending={AdditiveBlending} />
        </mesh>
        <mesh position={markerPoint}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#ff334b" />
        </mesh>
        <lineSegments ref={leaderLine}>
            <primitive object={leaderGeometry} attach="geometry" />
            <lineBasicMaterial color="#ff4054" transparent opacity={0.96} linewidth={2} />
        </lineSegments>
        <Html position={labelPoint} center={false} distanceFactor={16} zIndexRange={[5, 10]}>
            <div className="earth-html-label"><span className="pin-pulse" /><div><strong>Kanpur, Uttar Pradesh</strong><small>26.4499° N / 80.3319° E</small></div></div>
        </Html>
    </group>
}

function EarthScene() {
    const earthMap = useLoader(TextureLoader, EARTH_TEXTURE)
    useEffect(() => {
        earthMap.colorSpace = SRGBColorSpace
        earthMap.anisotropy = 8
        earthMap.wrapS = RepeatWrapping
        earthMap.offset.x = 0.39
        earthMap.needsUpdate = true
    }, [earthMap])

    return <>
        <ambientLight intensity={0.72} />
        <hemisphereLight args={['#d8f5ff', '#0b2340', 0.62]} />
        <directionalLight position={[4, 2, 5]} intensity={2.1} color="#d9f4ff" />
        <directionalLight position={[-4, -1, -3]} intensity={0.42} color="#3c83ff" />
        <group rotation={[0, KANPUR_FACING_ROTATION, 0]}>
            <mesh>
                <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
                <meshBasicMaterial map={earthMap} color={new Color('#ffffff')} />
            </mesh>
            <LocationMarker />
        </group>
    </>
}

function resetCamera(camera: PerspectiveCameraType, controls: OrbitControlsImpl) {
    camera.position.set(0, 0.15, 4.5)
    controls.target.set(0, 0, 0)
    controls.reset()
    controls.update()
}

export function EarthGlobe() {
    const camera = useRef<PerspectiveCameraType>(null)
    const controls = useRef<OrbitControlsImpl>(null)

    const changeZoom = (amount: number) => {
        if (!camera.current || !controls.current) return
        if (amount > 0) controls.current.dollyIn(1.2)
        else controls.current.dollyOut(1.2)
        controls.current.update()
    }

    return <div className="earth-canvas">
        <Canvas dpr={[1, 1.75]} resize={{ scroll: false, debounce: 0 }} gl={{ antialias: true, alpha: true }} style={{ width: '100%', height: '100%' }} onCreated={({ gl }) => {
            const bounds = gl.domElement.parentElement?.getBoundingClientRect()
            if (bounds) gl.setSize(bounds.width, bounds.height, false)
        }}>
            <PerspectiveCamera ref={camera} makeDefault position={[0, 0.15, 4.05]} fov={40} near={0.1} far={100} />
            <Stars radius={70} depth={24} count={1500} factor={2.2} saturation={0.32} fade speed={0.2} />
            <Suspense fallback={null}><EarthScene /></Suspense>
            <OrbitControls ref={controls} enablePan={false} enableDamping dampingFactor={0.08} autoRotate={false} autoRotateSpeed={0.28} minDistance={3} maxDistance={5.5} touches={{ ONE: 1, TWO: 2 }} />
        </Canvas>
        <div className="earth-controls" aria-label="Earth controls">
            <button type="button" onClick={() => changeZoom(1)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => changeZoom(-1)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => camera.current && controls.current && resetCamera(camera.current, controls.current)} aria-label="Reset camera">↻</button>
        </div>
        <div className="earth-compass" aria-label="Compass orientation"><span>N</span></div>
    </div>
}
