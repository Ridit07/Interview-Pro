import tensorflow as tf

# Define your model structure here to match the original model architecture
from modelutil import load_model  # Assuming the model architecture is in modelutil.py

# Load the model architecture

# Load weights from the checkpoint
checkpoint_dir = '/Users/riditjain/Downloads/LipNet-main/models - checkpoint 96'  # Directory where your checkpoint files are located
# Load the Keras model architecture
model = load_model()  # This should match the model architecture exactly

# Load the weights using TensorFlow's Checkpoint API
checkpoint = tf.train.Checkpoint(model=model)
status = checkpoint.restore(tf.train.latest_checkpoint(checkpoint_dir))
status.expect_partial()  # Allows partial matching without raising an error

# Save the model weights in .h5 format for Keras 3 compatibility
model.save_weights('/Users/riditjain/Downloads/LipNet-main/models - checkpoint 96/converted_checkpoint.weights.h5')
print("Model weights saved in .h5 format.")