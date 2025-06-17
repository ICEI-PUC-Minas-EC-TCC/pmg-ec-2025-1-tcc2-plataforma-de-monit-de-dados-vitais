import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { LocationPoint } from "./activityTracking";

interface CurrentLocationMapProps {
  currentLocation: LocationPoint | null;
  savedLocations: LocationPoint[];
}

export const CurrentLocationMap: React.FC<CurrentLocationMapProps> = ({
  currentLocation,
  savedLocations,
}) => {
  const generateMapHtml = () => {
    const center = currentLocation || {
      latitude: -23.5505,
      longitude: -46.6333,
    };
    const locations = savedLocations.length > 0 ? savedLocations : [center];

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
          <style>
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }
            #map {
              width: 100%;
              height: 100%;
              background-color: #f8f8f8;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            window.onload = function() {
              try {
                const map = L.map('map', {
                  zoomControl: true,
                  attributionControl: false,
                  dragging: false,
                  touchZoom: false,
                  scrollWheelZoom: false,
                  doubleClickZoom: false,
                  boxZoom: false,
                  keyboard: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                const center = [${center.latitude}, ${center.longitude}];
                map.setView(center, 15);

                // Adicionar marcador da localização atual
                L.marker(center, {
                  icon: L.divIcon({
                    className: 'current-location-icon',
                    html: '<div style="background-color: #A18AE6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>'
                  })
                }).addTo(map);

                // Adicionar linha do caminho se houver mais de uma localização
                if (${savedLocations.length} > 1) {
                  const path = ${JSON.stringify(
                    locations.map((loc) => [loc.latitude, loc.longitude])
                  )};
                  L.polyline(path, {
                    color: '#4CAF50',
                    weight: 3,
                    opacity: 0.8
                  }).addTo(map);
                }
              } catch (error) {
                console.error('Error initializing map:', error);
              }
            };
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{ html: generateMapHtml() }}
        scrollEnabled={false}
        zoomable={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    marginVertical: 10,
  },
  map: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
});
