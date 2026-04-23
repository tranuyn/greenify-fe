import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

// 1. Đưa HTML ra ngoài Component để nó không bao giờ bị render lại
const STATIC_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css' rel='stylesheet' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js'></script>
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; position: absolute; }
        .marker { width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: #10b981; transform: rotate(-45deg); border: 2px solid white; cursor: pointer; }
        .marker::after { content: ''; width: 12px; height: 12px; margin: 9px; background: white; border-radius: 50%; }
        .user-marker { width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.3); }
    </style>
</head>
<body>
    <div id='map'></div>
    <script>
        mapboxgl.accessToken = 'pk.eyJ1IjoidGhpZW5uZ3V5ZW4yNTA0IiwiYSI6ImNtYWRqbDIyYzA4N2YybG9maXNnZ2c1ZHIifQ.u21ONEVrSLiCn4GDA3BNdA';
        const map = new mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/streets-v12', center: [106.7009, 10.7769], zoom: 13 });
        let markers = [];

        // HÀM NÀY SẼ ĐƯỢC GỌI TỪ REACT NATIVE
        window.updateMarkers = (items) => {
            // Xóa tất cả marker cũ
            markers.forEach(m => m.remove());
            markers = [];
            // Thêm marker mới
            items.forEach(s => {
                if (s.longitude && s.latitude) {
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.onclick = () => window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ITEM_CLICK', data: s }));
                    const m = new mapboxgl.Marker(el).setLngLat([s.longitude, s.latitude]).addTo(map);
                    markers.push(m);
                }
            });
        };
    </script>
</body>
</html>
`;

export function MapView({ items, onSelectItem }: any) {
  const webViewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Mỗi khi items thay đổi, ta "bắn" code JS sang để update marker
  useEffect(() => {
    if (webViewRef.current && isMapReady) {
      const jsCode = `window.updateMarkers(${JSON.stringify(items || [])});`;
      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [items, isMapReady]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: STATIC_HTML }} // Chỉ load 1 lần duy nhất
        style={StyleSheet.absoluteFillObject}
        javaScriptEnabled={true}
        scrollEnabled={false}
        onLoadEnd={() => setIsMapReady(true)} // Khi map load xong, đánh dấu sẵn sàng
        onMessage={(e) => {
          const data = JSON.parse(e.nativeEvent.data);
          if (data.type === 'ITEM_CLICK') onSelectItem(data.data);
        }}
      />
    </View>
  );
}
