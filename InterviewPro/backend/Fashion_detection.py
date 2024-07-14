# Group the categories based on types
from transformers import YolosFeatureExtractor, YolosForObjectDetection
from transformers import AutoModelForObjectDetection
import torch
from torchvision.transforms import ToPILImage, ToTensor
from PIL import Image, ImageDraw
import lightning as pl


class Yolos(pl.LightningModule):
    
    def __init__(self, lr, weight_decay):
        super().__init__()
        self.model = AutoModelForObjectDetection.from_pretrained("valentinafeve/yolos-fashionpedia", 
                                                                 num_labels=46,
                                                                 ignore_mismatched_sizes=True)
        self.lr = lr
        self.weight_decay = weight_decay

    def forward(self, pixel_values):
        outputs = self.model(pixel_values=pixel_values)
        return outputs
    
    def common_step(self, batch, batch_idx):
        pixel_values = batch["pixel_values"]
        labels = [{k: v.to(self.device) for k, v in t.items()} for t in batch["labels"]]

        outputs = self.model(pixel_values=pixel_values, labels=labels)

        loss = outputs.loss
        loss_dict = outputs.loss_dict

        return loss, loss_dict

    def training_step(self, batch, batch_idx):
        loss, loss_dict = self.common_step(batch, batch_idx)     
        self.log("training_loss", loss)
        for k,v in loss_dict.items():
            self.log("train_" + k, v.item())
        
        return loss

    def validation_step(self, batch, batch_idx):
        loss, loss_dict = self.common_step(batch, batch_idx)     
        self.log("validation_loss", loss)
        for k,v in loss_dict.items():
            self.log("validation_" + k, v.item())
        
        return loss

    def test_step(self, batch, batch_idx):
        loss, loss_dict = self.common_step(batch, batch_idx)     
        self.log("test_loss", loss)
        for k,v in loss_dict.items():
            self.log("test_" + k, v.item())
        
        return loss

    def configure_optimizers(self):
        optimizer = torch.optim.AdamW(self.parameters(), lr=self.lr,
                                  weight_decay=self.weight_decay)
        
        return optimizer
    
    def train_dataloader(self):
        return train_dataloader
    
    def val_dataloader(self):
        return val_dataloader
    
    def test_dataloader(self):
        return test_dataloader


group_tops_outerwear = ['shirt, blouse', 'top, t-shirt, sweatshirt', 'sweater', 'cardigan', 'jacket', 'vest', 'coat', 'cape', 'dress', 'jumpsuit']
group_bottoms = ['pants', 'shorts', 'skirt']
group_footwear = ['shoe', 'sock']
group_accessories = ['glasses', 'hat', 'headband, head covering, hair accessory', 'tie', 'glove', 'watch', 'belt', 'leg warmer', 'tights, stockings', 'bag, wallet', 'scarf', 'umbrella']
group_clothing_details = ['hood', 'collar', 'lapel', 'epaulette', 'sleeve', 'pocket', 'neckline', 'buckle', 'zipper']
group_embellishments = ['applique', 'bead', 'bow', 'flower', 'fringe', 'ribbon', 'rivet', 'ruffle', 'sequin', 'tassel']

group_mapping = {}
for category in group_tops_outerwear:
    group_mapping[category] = 'Tops and Outerwear'
for category in group_bottoms:
    group_mapping[category] = 'Bottoms'
for category in group_footwear:
    group_mapping[category] = 'Footwear'
for category in group_accessories:
    group_mapping[category] = 'Accessories'
for category in group_clothing_details:
    group_mapping[category] = 'Clothing Details'
for category in group_embellishments:
    group_mapping[category] = 'Embellishments'


color_mapping = {
    'Tops and Outerwear': '#FFC1E0',       # Light pink
    'Bottoms': '#A7F7C0',                   # Light green
    'Footwear': '#E1BEE7',                  # Light purple
    'Accessories': '#FFD8B1',                # Light orange
    'Clothing Details': '#B3E5FC',           # Light blue
    'Embellishments': '#FFF9C4'              # Light yellow
}

# Load the pretrained feature extractor from the YOLO-small model
feature_extractor = YolosFeatureExtractor.from_pretrained('hustvl/yolos-small')

# Load the model from a checkpoint, setting the learning rate and weight decay
model_tags = Yolos.load_from_checkpoint(
    checkpoint_path='/Users/riditjain/Downloads/fashion_model.ckpt',  # Path to the checkpoint
    lr=2.5e-5,  # Learning rate for fine-tuning
    weight_decay=1e-4  # Weight decay for regularization
)

# for output bounding box post-processing
def box_cxcywh_to_xyxy(x):
    x_c, y_c, w, h = x.unbind(1)
    b = [(x_c - 0.5 * w), (y_c - 0.5 * h),
         (x_c + 0.5 * w), (y_c + 0.5 * h)]
    return torch.stack(b, dim=1)

def rescale_bboxes(out_bbox, size):
    img_w, img_h = size
    b = box_cxcywh_to_xyxy(out_bbox)
    b = b * torch.tensor([img_w, img_h, img_w, img_h], dtype=torch.float32)
    return b

def idx_to_text(i):
    return cats_list[i]

cats_list = ['shirt, blouse', 'top, t-shirt, sweatshirt', 'sweater', 
             'cardigan', 'jacket', 'vest', 'pants', 'shorts', 'skirt', 
             'coat', 'dress', 'jumpsuit', 'cape', 'glasses', 'hat', 
             'headband, head covering, hair accessory', 'tie',
             'glove', 'watch', 'belt', 'leg warmer', 'tights, stockings', 
             'sock', 'shoe', 'bag, wallet', 'scarf', 'umbrella', 'hood', 'collar', 
             'lapel', 'epaulette', 'sleeve', 'pocket', 'neckline', 'buckle', 
             'zipper', 'applique', 'bead', 'bow', 'flower', 'fringe', 'ribbon', 
             'rivet', 'ruffle', 'sequin', 'tassel']

# Group the categories based on types
group_tops_outerwear = ['shirt, blouse', 'top, t-shirt, sweatshirt', 'sweater', 'cardigan', 'jacket', 'vest', 'coat', 'cape', 'dress', 'jumpsuit']
group_bottoms = ['pants', 'shorts', 'skirt']
group_footwear = ['shoe', 'sock']
group_accessories = ['glasses', 'hat', 'headband, head covering, hair accessory', 'tie', 'glove', 'watch', 'belt', 'leg warmer', 'tights, stockings', 'bag, wallet', 'scarf', 'umbrella']
group_clothing_details = ['hood', 'collar', 'lapel', 'epaulette', 'sleeve', 'pocket', 'neckline', 'buckle', 'zipper']
group_embellishments = ['applique', 'bead', 'bow', 'flower', 'fringe', 'ribbon', 'rivet', 'ruffle', 'sequin', 'tassel']

group_mapping = {}
for category in group_tops_outerwear:
    group_mapping[category] = 'Tops and Outerwear'
for category in group_bottoms:
    group_mapping[category] = 'Bottoms'
for category in group_footwear:
    group_mapping[category] = 'Footwear'
for category in group_accessories:
    group_mapping[category] = 'Accessories'
for category in group_clothing_details:
    group_mapping[category] = 'Clothing Details'
for category in group_embellishments:
    group_mapping[category] = 'Embellishments'

color_mapping = {
    'Tops and Outerwear': '#FFC1E0',       # Light pink
    'Bottoms': '#A7F7C0',                   # Light green
    'Footwear': '#E1BEE7',                  # Light purple
    'Accessories': '#FFD8B1',                # Light orange
    'Clothing Details': '#B3E5FC',           # Light blue
    'Embellishments': '#FFF9C4'              # Light yellow
}

import matplotlib.pyplot as plt


def plot_results(pil_img, prob, boxes, show_image=True):
    if show_image:
        plt.figure(figsize=(16, 10))
        plt.imshow(pil_img)
        ax = plt.gca()
    unique_categories = {}

    for p, (xmin, ymin, xmax, ymax) in zip(prob, boxes.tolist()):
        cl = p.argmax()
        category = idx_to_text(cl)
        group = group_mapping[category]
        color = color_mapping[group]

        if show_image:
            ax.add_patch(plt.Rectangle((xmin, ymin), xmax - xmin, ymax - ymin,
                                       fill=False, color=color, linewidth=1))

            # Determine the label position based on the category
            if group in ['Accessories', 'Clothing Details', 'Embellishments']:
                label_x = xmax  # Position the label in the lower right corner of the bounding box
                label_y = ymax  # Position the label in the lower right corner of the bounding box
                ha = 'right'
                va = 'bottom'
            else:
                label_x = xmin  # Position the label in the upper left corner of the bounding box
                label_y = ymin  # Position the label in the upper left corner of the bounding box
                ha = 'left'
                va = 'top'

            ax.text(label_x, label_y, category, fontsize=8, ha=ha, va=va,
                    bbox=dict(facecolor=color, alpha=0.8, pad=0.2))

        if group not in unique_categories:
            unique_categories[group] = set()
        unique_categories[group].add(category)

    if show_image:
        plt.axis('off')
        plt.show()

    for group, categories in unique_categories.items():
        # Convert categories to a list with '/' separator, then join them
        detected = ', '.join([', '.join(word.split(', ')).replace(', ', '/') for word in categories])

        # Print group and corresponding category string
        print(f"{group}: {detected}")
    print("\n\n")

def visualize_predictions(image, outputs, threshold=0.7, show_image=True):
    # keep only predictions with confidence >= threshold
    probas = outputs.logits.softmax(-1)[0, :, :-1]
    keep = probas.max(-1).values > threshold

    # convert predicted boxes from [0; 1] to image scales
    bboxes_scaled = rescale_bboxes(outputs.pred_boxes[0, keep].cpu(), image.size)

    # plot results
    plot_results(image, probas[keep], bboxes_scaled, show_image)
    
    
def fix_channels(t):
    if len(t.shape) == 2:
        return ToPILImage()(torch.stack([t for i in (0, 0, 0)]))
    if t.shape[0] == 4:
        return ToPILImage()(t[:3])
    if t.shape[0] == 1:
        return ToPILImage()(torch.stack([t[0] for i in (0, 0, 0)]))
    return ToPILImage()(t)


def process_image(IMAGE_PATH, threshold=0.7, show_image=True):
    print(IMAGE_PATH)

    image = Image.open(open(IMAGE_PATH, "rb"))
    image = fix_channels(ToTensor()(image))
    image = image.resize((600, 800))
    
    inputs = feature_extractor(images=image, return_tensors="pt")
    outputs = model_tags(**inputs)
    
    img = visualize_predictions(image, outputs, threshold, show_image)

    return img

def process_images(image_paths, threshold=0.7, show_image=True):
    results = []
    for image_path in image_paths:
        result = process_image(image_path, threshold, show_image)
        results.append(result)
    return results

# Single image, show_image=True
#IMAGE_PATH = ["/Users/riditjain/Downloads/IMG_5731.jpg"]
#process_images(IMAGE_PATH, threshold=0.8, show_image=True)