import pandas as pd

class DataCharacteristics:
    def __init__(self, file_path, hasID=True):
        self.file_path = file_path
        self.hasID = hasID

    def calculation(self):
        if self.hasID:
            df = pd.read_csv(self.file_path)
            df = df.iloc[:, 1:]
        else:
            df = pd.read_csv(self.file_path)
        df = df.select_dtypes(include='number')
        df.dropna(inplace=True)
        
        mean = df.mean()
        mean_dict = {}
        for feature, value in mean.items():
            mean_dict[feature] = value
        return mean_dict
    
   


