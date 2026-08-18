import { useState } from 'react';
import {
    MapPin,
    Navigation,
    Compass,
    LocateFixed,
    Globe,
    Eye,
    EyeOff,
    CheckCircle2,
    Sliders,
    Layers,
    Activity,
    ShieldCheck,
    Info,
    ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationSettingsProps {
    data: any;
    setData: (key: string | ((prev: any) => any), value?: any) => void;
    errors?: Record<string, string>;
}

export function LocationSettings({ data, setData, errors }: LocationSettingsProps) {
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    const toggleKeyVisibility = (key: string) => {
        setShowKey((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="api_keys" className="space-y-6">
                <TabsList className="grid grid-cols-1 sm:grid-cols-3 h-auto p-1 bg-muted/40 rounded-xl border border-border/60 gap-1">
                    <TabsTrigger value="api_keys" className="py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2">
                        <Globe className="size-3.5 text-blue-500" />
                        <span>Google Maps API Keys</span>
                    </TabsTrigger>
                    <TabsTrigger value="map_defaults" className="py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2">
                        <Compass className="size-3.5 text-amber-500" />
                        <span>Map Defaults & Styling</span>
                    </TabsTrigger>
                    <TabsTrigger value="live_tracking" className="py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2">
                        <Activity className="size-3.5 text-emerald-500" />
                        <span>Live GPS Tracking Engine</span>
                    </TabsTrigger>
                </TabsList>

                {/* 1. Google Maps API Keys */}
                <TabsContent value="api_keys" className="space-y-6">
                    <div className="p-6 rounded-2xl border border-border/70 bg-card space-y-6 shadow-xs">
                        <div>
                            <h4 className="font-bold text-base text-foreground">Google Maps API Credentials</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Enter your Google Cloud Platform API Key with Maps JavaScript, Geocoding, and Places APIs enabled.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="google_maps_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Primary Google Maps JavaScript API Key
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="google_maps_api_key"
                                        type={showKey.maps ? 'text' : 'password'}
                                        value={data.google_maps_api_key || ''}
                                        onChange={(e) => setData('google_maps_api_key', e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('maps')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.maps ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Used for rendering interactive maps, markers, polygons, and live route paths.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="google_geocoding_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Geocoding & Reverse Geocoding Key (Optional Dedicated Key)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="google_geocoding_api_key"
                                        type={showKey.geocoding ? 'text' : 'password'}
                                        value={data.google_geocoding_api_key || ''}
                                        onChange={(e) => setData('google_geocoding_api_key', e.target.value)}
                                        placeholder="Leave blank to use primary key"
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('geocoding')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.geocoding ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Converts coordinates to street addresses & vice versa.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="google_places_api_key" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Places & Autocomplete Key (Optional Dedicated Key)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="google_places_api_key"
                                        type={showKey.places ? 'text' : 'password'}
                                        value={data.google_places_api_key || ''}
                                        onChange={(e) => setData('google_places_api_key', e.target.value)}
                                        placeholder="Leave blank to use primary key"
                                        className="h-10 pr-10 rounded-lg font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('places')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showKey.places ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Enables address search suggestions and place autofill.</p>
                            </div>
                        </div>

                        {/* Google Cloud Checklist Card */}
                        <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
                            <div className="flex items-center gap-2">
                                <Info className="size-4 text-blue-500" />
                                <span className="font-semibold text-xs text-foreground">Required Google Cloud APIs:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                    <span>Maps JavaScript API</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                    <span>Geocoding API</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                    <span>Places API (New)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                    <span>Distance Matrix API (Optional for Route Calc)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* 2. Map Defaults & Styling */}
                <TabsContent value="map_defaults" className="space-y-6">
                    <div className="p-6 rounded-2xl border border-border/70 bg-card space-y-6 shadow-xs">
                        <div>
                            <h4 className="font-bold text-base text-foreground">Map Defaults & Coordinates</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Set default viewport center coordinates, initial zoom, and theme styling for map components.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="default_map_latitude" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Default Center Latitude
                                </Label>
                                <Input
                                    id="default_map_latitude"
                                    value={data.default_map_latitude || '28.6139'}
                                    onChange={(e) => setData('default_map_latitude', e.target.value)}
                                    placeholder="e.g. 28.6139"
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="default_map_longitude" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Default Center Longitude
                                </Label>
                                <Input
                                    id="default_map_longitude"
                                    value={data.default_map_longitude || '77.2090'}
                                    onChange={(e) => setData('default_map_longitude', e.target.value)}
                                    placeholder="e.g. 77.2090"
                                    className="h-10 rounded-lg font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="default_map_zoom" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Initial Zoom Level (1 - 20)
                                </Label>
                                <Input
                                    id="default_map_zoom"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={data.default_map_zoom || '14'}
                                    onChange={(e) => setData('default_map_zoom', e.target.value)}
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="map_default_theme" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Default Map Style Theme
                                </Label>
                                <Select
                                    value={data.map_default_theme || 'roadmap'}
                                    onValueChange={(val) => setData('map_default_theme', val)}
                                >
                                    <SelectTrigger id="map_default_theme" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Map Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="roadmap">Standard Roadmap</SelectItem>
                                        <SelectItem value="satellite">Satellite Imagery</SelectItem>
                                        <SelectItem value="hybrid">Hybrid (Satellite + Roads)</SelectItem>
                                        <SelectItem value="terrain">Terrain View</SelectItem>
                                        <SelectItem value="dark">Dark Theme (Night Mode)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* 3. Live GPS Tracking Engine */}
                <TabsContent value="live_tracking" className="space-y-6">
                    <div className="p-6 rounded-2xl border border-border/70 bg-card space-y-6 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                            <div>
                                <h4 className="font-bold text-base text-foreground">Real-Time GPS Tracking Engine</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Configure live employee and asset tracking frequencies, precision modes, and idle behaviors.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Label htmlFor="location_tracking_enabled" className="text-xs font-semibold cursor-pointer">
                                    Live Tracking
                                </Label>
                                <Switch
                                    id="location_tracking_enabled"
                                    checked={data.location_tracking_enabled === '1'}
                                    onCheckedChange={(c) => setData('location_tracking_enabled', c ? '1' : '0')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tracking_interval_seconds" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    GPS Ping Interval (Seconds)
                                </Label>
                                <Input
                                    id="tracking_interval_seconds"
                                    type="number"
                                    min="5"
                                    value={data.tracking_interval_seconds || '15'}
                                    onChange={(e) => setData('tracking_interval_seconds', e.target.value)}
                                    placeholder="15"
                                    className="h-10 rounded-lg"
                                />
                                <p className="text-[11px] text-muted-foreground">Frequency of sending location updates to server (e.g. 15s - 60s).</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tracking_min_distance_meters" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Minimum Distance Filter (Meters)
                                </Label>
                                <Input
                                    id="tracking_min_distance_meters"
                                    type="number"
                                    min="1"
                                    value={data.tracking_min_distance_meters || '10'}
                                    onChange={(e) => setData('tracking_min_distance_meters', e.target.value)}
                                    placeholder="10"
                                    className="h-10 rounded-lg"
                                />
                                <p className="text-[11px] text-muted-foreground">Ignores GPS jitter if device moved less than this distance.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tracking_accuracy_mode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Tracking Accuracy Mode
                                </Label>
                                <Select
                                    value={data.tracking_accuracy_mode || 'high'}
                                    onValueChange={(val) => setData('tracking_accuracy_mode', val)}
                                >
                                    <SelectTrigger id="tracking_accuracy_mode" className="h-10 rounded-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High Accuracy (GPS + Wi-Fi + Cell)</SelectItem>
                                        <SelectItem value="balanced">Balanced (Wi-Fi + Cellular Networks)</SelectItem>
                                        <SelectItem value="battery_saver">Battery Saver (Passive Updates)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="geofence_default_radius_meters" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Default Geofencing Radius (Meters)
                                </Label>
                                <Input
                                    id="geofence_default_radius_meters"
                                    type="number"
                                    min="10"
                                    value={data.geofence_default_radius_meters || '100'}
                                    onChange={(e) => setData('geofence_default_radius_meters', e.target.value)}
                                    placeholder="100"
                                    className="h-10 rounded-lg"
                                />
                                <p className="text-[11px] text-muted-foreground">Default radius around company sites / client locations.</p>
                            </div>

                            <div className="space-y-3 md:col-span-2 p-4 rounded-xl border border-border/70 bg-muted/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="auto_stop_idle_tracking" className="text-sm font-semibold cursor-pointer">
                                            Auto-Pause Tracking When Stationary / Idle
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Saves device battery when no significant movement is detected.</p>
                                    </div>
                                    <Switch
                                        id="auto_stop_idle_tracking"
                                        checked={data.auto_stop_idle_tracking === '1'}
                                        onCheckedChange={(c) => setData('auto_stop_idle_tracking', c ? '1' : '0')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
