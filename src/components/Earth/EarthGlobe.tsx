import { Html, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { forwardRef, Suspense, useEffect, useImperativeHandle, useRef } from 'react'
import { AdditiveBlending, BufferGeometry, Color, Matrix4, Quaternion, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import type { Group, LineSegments, Mesh, PerspectiveCamera as PerspectiveCameraType } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const EARTH_RADIUS = 1.5
const EARTH_TEXTURE = '/assets/earth-daymap-2048.jpg'

const KANPUR = { latitude: 26.4499, longitude: 80.3319 }
const DEFAULT_FOCUS_DURATION = 900

export function latLngToVector3(latitude: number, longitude: number, radius: number) {
    const latitudeRadians = (latitude * Math.PI) / 180
    const longitudeRadians = (-longitude * Math.PI) / 180
    return new Vector3(
        radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
        radius * Math.sin(latitudeRadians),
        radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians),
    )
}

export interface GlobeLocation {
    latitude: number
    longitude: number
    label?: string
}

export interface EarthGlobeHandle {
    focusLocation: (latitude: number, longitude: number, duration?: number) => void
}

function locationRotation(latitude: number, longitude: number) {
    const point = latLngToVector3(latitude, longitude, 1).normalize()
    const latitudeRadians = (latitude * Math.PI) / 180
    const longitudeRadians = (-longitude * Math.PI) / 180
    const north = new Vector3(
        -Math.sin(latitudeRadians) * Math.cos(longitudeRadians),
        Math.cos(latitudeRadians),
        -Math.sin(latitudeRadians) * Math.sin(longitudeRadians),
    ).normalize()
    const right = north.clone().cross(point).normalize()
    return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(right, north, point).invert())
}

export function focusLocation(group: Group, latitude: number, longitude: number, duration = DEFAULT_FOCUS_DURATION) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return
    const target = locationRotation(latitude, longitude)
    const start = group.quaternion.clone()
    const startedAt = performance.now()
    const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / Math.max(duration, 0), 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        group.quaternion.copy(start).slerp(target, eased)
        if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
}

function LocationMarker({ location }: { location: GlobeLocation }) {
    const pulse = useRef<Mesh>(null)
    const leaderLine = useRef<LineSegments>(null)
    const markerPoint = latLngToVector3(location.latitude, location.longitude, EARTH_RADIUS + 0.045)
    const labelPoint = latLngToVector3(location.latitude, location.longitude, EARTH_RADIUS + 0.32)
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
            <div className="earth-html-label"><span className="pin-pulse" /><div><strong>{location.label ?? 'Selected location'}</strong><small>{location.latitude.toFixed(4)}° / {location.longitude.toFixed(4)}°</small></div></div>
        </Html>
    </group>
}

function EarthScene({ location, groupRef }: { location: GlobeLocation; groupRef: React.RefObject<Group | null> }) {
    const earthMap = useLoader(TextureLoader, EARTH_TEXTURE)
    useEffect(() => {
        earthMap.colorSpace = SRGBColorSpace
        earthMap.anisotropy = 8
        earthMap.wrapS = RepeatWrapping
        earthMap.offset.x = 0
        earthMap.needsUpdate = true
    }, [earthMap])

    useEffect(() => {
        if (groupRef.current) focusLocation(groupRef.current, location.latitude, location.longitude)
    }, [groupRef, location.latitude, location.longitude])

    return <>
        <ambientLight intensity={0.72} />
        <hemisphereLight args={['#d8f5ff', '#0b2340', 0.62]} />
        <directionalLight position={[4, 2, 5]} intensity={2.1} color="#d9f4ff" />
        <directionalLight position={[-4, -1, -3]} intensity={0.42} color="#3c83ff" />
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
                <meshBasicMaterial map={earthMap} color={new Color('#ffffff')} />
                <LocationMarker location={location} />
            </mesh>
            
        </group>
    </>
}

function resetCamera(camera: PerspectiveCameraType, controls: OrbitControlsImpl) {
    camera.position.set(0, 0.15, 4.5)
    controls.target.set(0, 0, 0)
    controls.reset()
    controls.update()
}

export const EarthGlobe = forwardRef<EarthGlobeHandle, { location?: GlobeLocation }>(function EarthGlobe({ location = KANPUR }, ref) {
    const camera = useRef<PerspectiveCameraType>(null)
    const controls = useRef<OrbitControlsImpl>(null)
    const earthGroup = useRef<Group>(null)

    useEffect(() => {
        if (camera.current) camera.current.up.set(0, 1, 0)
        if (controls.current) {
            controls.current.target.set(0, 0, 0)
            controls.current.update()
        }
    }, [])

    useImperativeHandle(ref, () => ({
        focusLocation: (latitude, longitude, duration) => {
            if (earthGroup.current) focusLocation(earthGroup.current, latitude, longitude, duration)
        },
    }), [])

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
            <Suspense fallback={null}><EarthScene location={location} groupRef={earthGroup} /></Suspense>
            <OrbitControls ref={controls} enablePan={false} enableDamping dampingFactor={0.08} autoRotate={false} autoRotateSpeed={0.28} minDistance={3} maxDistance={5.5} touches={{ ONE: 1, TWO: 2 }} />
        </Canvas>
        <div className="earth-controls" aria-label="Earth controls">
            <button type="button" onClick={() => changeZoom(1)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => changeZoom(-1)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => camera.current && controls.current && resetCamera(camera.current, controls.current)} aria-label="Reset camera">↻</button>
        </div>
        <div className="earth-compass" aria-label="Compass orientation"><span>N</span></div>
    </div>
})
