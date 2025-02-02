import cv2
from gaze_tracking import GazeTracking

def analyze_gaze_in_video(video_path):
    gaze = GazeTracking()
    video = cv2.VideoCapture(video_path)
    
    # Video properties
    fps = video.get(cv2.CAP_PROP_FPS)
    
    # Initialize counters and variables
    left_count = 0
    right_count = 0
    long_left_count = 0
    long_right_count = 0

    current_direction = None
    frames_in_direction = 0  # Counts frames in the same direction

    # Frame processing loop
    frame_number = 0
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break

        # Analyze the current frame
        gaze.refresh(frame)
        frame_number += 1

        # Debug: Print the current frame number and gaze direction
        if gaze.is_left():
            direction = "left"
            #print(f"Frame {frame_number}: Looking left")
        elif gaze.is_right():
            direction = "right"
            #print(f"Frame {frame_number}: Looking right")
        else:
            direction = "center"
           # print(f"Frame {frame_number}: Looking center or not detected")

        # Check for continuous direction and timing
        if direction != "center":
            if current_direction == direction:
                # Increment frame count in the same direction
                frames_in_direction += 1
            else:
                # Log previous direction if it was left or right
                if current_direction == "left":
                    left_count += 1
                    if frames_in_direction / fps > 5:
                        long_left_count += 1
                elif current_direction == "right":
                    right_count += 1
                    if frames_in_direction / fps > 5:
                        long_right_count += 1
                
                # Reset for the new direction
                current_direction = direction
                frames_in_direction = 1
        else:
            # Reset if looking away
            if current_direction == "left" or current_direction == "right":
                # Log previous direction counts before reset
                if current_direction == "left":
                    left_count += 1
                    if frames_in_direction / fps > 5:
                        long_left_count += 1
                elif current_direction == "right":
                    right_count += 1
                    if frames_in_direction / fps > 5:
                        long_right_count += 1
                
            current_direction = None
            frames_in_direction = 0

    # Release video
    video.release()
    
    # Print results
    # print(f"Total times looking left: {left_count}")
    # print(f"Total times looking right: {right_count}")
    # print(f"Times looking left for more than 5 seconds: {long_left_count}")
    # print(f"Times looking right for more than 5 seconds: {long_right_count}")
    return left_count, right_count, long_left_count, long_right_count

# Call the function with the path to your video file



# Call the function with the path to your video file
#analyze_gaze_in_video("/Users/riditjain/Downloads/WhatsApp Video 2024-11-02 at 00.19.02.mp4")
