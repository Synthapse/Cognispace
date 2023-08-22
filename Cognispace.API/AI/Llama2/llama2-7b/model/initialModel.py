
class Model:
    def __init__(self, **kwargs):
        # Uncomment the following to get access
        # to various parts of the Truss config.

        # self._data_dir = kwargs["data_dir"]
        # self._config = kwargs["config"]
        # self._secrets = kwargs["secrets"]
        self._model = None

    def load(self):
        # Load model here and assign to self._model.
        pass

    def predict(self, model_input):
        # Run model inference here
        return model_input
