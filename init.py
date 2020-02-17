import s3fs
import xarray as xr
import pandas as pd

credentials = pd.read_csv('./.aws/credentials.csv')
fs = s3fs.S3FileSystem(key=credentials['Access key ID'][0], secret=credentials['Secret access key'][0])
mapper = fs.get_mapper('greenlytics-public/NWP/NCEP/GFS/2020/02/13/00.zarr')
ds = xr.open_zarr(mapper, consolidated=True)

print ("hello world");
print (ds);
