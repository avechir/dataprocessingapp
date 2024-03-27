import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import io 

class KMeansClustering:
    def __init__(self, file_path, hasID):
        self.file_path = file_path
        self.hasID = hasID
    
    def clusterizationFunction(self, featureforplot1, featureforplot2, num_clusters = 3):
        if self.hasID:
            df = pd.read_csv(self.file_path)
            df = df.iloc[:, 1:]
        else:
            df = pd.read_csv(self.file_path)

        numeric_df = df.select_dtypes(include='number')
        numeric_df.dropna(inplace=True)
        print(numeric_df)
        
        kmeans = KMeans(n_clusters=num_clusters)
        clusters = kmeans.fit_predict(numeric_df)

        centroids = kmeans.cluster_centers_

        plt.figure()
        plt.scatter(numeric_df[featureforplot1], numeric_df[featureforplot2], c=clusters)
        plt.scatter(centroids[:, numeric_df.columns.get_loc(featureforplot1)], 
                    centroids[:, numeric_df.columns.get_loc(featureforplot2)], 
                    marker='x', s=100, c='#ff7f0e')
        plt.xlabel(featureforplot1)
        plt.ylabel(featureforplot2)
        plt.title('K-means Clustering')
        fig = plt.gcf() 
        buf = io.BytesIO() 

        fig.savefig(buf, format='png') 
        fig.clear()
        plt.clf()
        buf.seek(0) 
        return buf
     