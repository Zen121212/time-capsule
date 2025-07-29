<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LocationService
{
    /**
     * Get location details from IP address using free IP-API service
     *
     * @param string $ip
     * @return array
     */
    public function getLocationFromIp(string $ip): array
    {
        try {
            if ($ip === '127.0.0.1' || $ip === '::1' || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.') || str_starts_with($ip, '172.')) {
                return $this->getDefaultLocation();
            }
            $response = Http::timeout(5)->get("http://ip-api.com/json/{$ip}");
            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['status'] === 'success') {
                    return [
                        'city' => $data['city'] ?? 'Unknown',
                        'country' => $data['country'] ?? 'Unknown',
                        'region' => $data['regionName'] ?? null,
                        'latitude' => $data['lat'] ?? null,
                        'longitude' => $data['lon'] ?? null,
                        'formatted_address' => $this->formatAddress($data['city'], $data['regionName'], $data['country']),
                    ];
                }
            }
    
            return $this->getDefaultLocation();
            
        } catch (\Exception $e) {
            Log::warning('Failed to get location from IP', [
                'ip' => $ip,
                'error' => $e->getMessage()
            ]);
            
            return $this->getDefaultLocation();
        }
    }

    /**
     * Get user's real IP address (handles proxies)
     *
     * @return string
     */
    public function getRealIpAddress(): string
    {
        $headers = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_CLIENT_IP',            // Proxy
            'HTTP_X_FORWARDED_FOR',      // Load Balancer/Proxy
            'HTTP_X_FORWARDED',          // Proxy
            'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
            'HTTP_FORWARDED_FOR',        // Proxy
            'HTTP_FORWARDED',            // Proxy
            'REMOTE_ADDR'                // Standard
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                $ip = trim($ips[0]);
                
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return request()->ip() ?? '127.0.0.1';
    }

    /**
     * Format address string
     *
     * @param string|null $city
     * @param string|null $region
     * @param string|null $country
     * @return string
     */
    private function formatAddress(?string $city, ?string $region, ?string $country): string
    {
        $parts = array_filter([$city, $region, $country]);
        return implode(', ', $parts) ?: 'Unknown Location';
    }

    /**
     * Get location from GPS coordinates using reverse geocoding
     *
     * @param float $latitude
     * @param float $longitude
     * @return array
     */
    public function getLocationFromCoordinates(float $latitude, float $longitude): array
    {
        try {
            $url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={$latitude}&lon={$longitude}";
            $response = Http::timeout(5)->get($url);
            
            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['address'])) {
                    $address = $data['address'];
                    $city = $address['city'] ?? $address['town'] ?? $address['village'] ?? 'Unknown';
                    $country = $address['country'] ?? 'Unknown';
                    $region = $address['state'] ?? $address['region'] ?? null;
                    
                    return [
                        'city' => $city,
                        'country' => $country,
                        'region' => $region,
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'formatted_address' => $this->formatAddress($city, $region, $country),
                    ];
                }
            }
            return [
                'city' => 'Unknown',
                'country' => 'Unknown',
                'region' => null,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'formatted_address' => 'GPS Location',
            ];
            
        } catch (\Exception $e) {
            Log::warning('Failed to reverse geocode GPS coordinates', [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'error' => $e->getMessage()
            ]);
            
            return [
                'city' => 'Unknown',
                'country' => 'Unknown',
                'region' => null,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'formatted_address' => 'GPS Location',
            ];
        }
    }

    /**
     * Get default location for localhost/development
     *
     * @return array
     */
    private function getDefaultLocation(): array
    {
        return [
            'city' => 'Development',
            'country' => 'Local',
            'region' => 'Localhost',
            'latitude' => null,
            'longitude' => null,
            'formatted_address' => 'Development Environment',
        ];
    }
}

