import h3pandas
import geopandas as gpd

import matplotlib.pyplot as plt
import contextily as ctx
df = gpd.read_file("map.json")
print("here")
resolution = 5
hexagons = df.h3.polyfill_resample(resolution)

hexagons = hexagons.to_crs(epsg=3857)

fig, ax = plt.subplots(figsize=(10, 10))

# hexagons['Polygons'] = [Polygon(polygon) for polygon in hexagons['Polygons']]
# print(hexagons)
# gdf = gpd.GeoDataFrame(hexagons, geometry='Polygons')
hexagons.plot(ax=ax, alpha=0.5, edgecolor='k')

ctx.add_basemap(ax, source=ctx.providers.OpenStreetMap.Mapnik)

# Adjust the axis limits to the bounds of the GeoDataFrame
ax.set_xlim(hexagons.total_bounds[[0, 2]])
ax.set_ylim(hexagons.total_bounds[[1, 3]])

plt.axis('off')

string = hexagons.to_file("../client/app/Map/map.json", driver="GeoJSON") 
plt.show()

