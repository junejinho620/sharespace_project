import pandas as pd
import numpy as np

# Load Fomi profiles from local static mapping
fomi_profiles = pd.DataFrame({
    "Fomi Type": [
        "Quiet Fomi", "Energy Fomi", "Emotional Fomi", "Free Fomi", "Wanderer Fomi", "Noisy Fomi",
        "Moderate Fomi", "Sensitive Fomi", "Care Fomi", "Homebody Fomi", "Coexist Fomi",
        "Balanced Fomi", "Night Owl Fomi", "Independent Fomi", "Collab Fomi", "Adaptive Fomi"
    ],
    "Introversion": [5,1,4,3,2,2,3,5,3,5,4,3,4,5,2,3],
    "Extroversion": [1,5,2,4,5,5,3,1,4,1,2,3,2,1,5,4],
    "Cleanliness": [4,3,4,4,2,2,3,4,5,4,4,3,3,4,4,3],
    "Noise Tolerance": [5,2,4,3,2,1,3,5,3,5,4,3,3,5,3,3],
    "Guest Tolerance": [1,5,2,4,5,4,3,1,4,1,3,3,2,1,5,4],
    "Sleep Schedule": [3,4,4,4,5,5,3,3,3,2,3,3,5,3,4,3],
    "Work Rhythm": [3,4,3,4,4,4,3,3,3,2,3,3,2,3,4,4],
    "Social Needs": [1,5,2,4,4,5,3,2,4,1,3,3,2,1,5,3],
    "Flexibility": [3,3,3,5,5,2,3,2,3,2,3,3,3,3,3,4],
    "Sensitivity": [3,2,5,2,2,2,3,5,4,3,4,3,4,3,3,3],
    "Caregiving": [1,2,3,1,1,1,2,2,5,2,3,3,2,1,4,3],
    "Independence": [4,1,2,3,1,1,3,4,2,4,2,3,3,5,2,3],
    "Teamwork": [1,4,2,3,2,3,3,1,4,1,3,3,2,1,5,4],
    "Creativity": [2,2,4,3,3,2,3,3,2,3,3,3,5,2,3,3],
    "Homebody": [5,2,3,2,1,3,3,4,4,5,4,3,4,4,3,4],
    "Adaptability": [2,4,3,4,4,3,3,2,3,2,3,3,2,3,4,5]
}).set_index("Fomi Type")

qa_to_trait_map = {
    ("Q12", "a"): {"Noise Tolerance": 1}, ("Q12", "b"): {"Noise Tolerance": 2}, ("Q12", "c"): {"Noise Tolerance": 3},
    ("Q12", "d"): {"Noise Tolerance": 4}, ("Q12", "e"): {"Noise Tolerance": 5},
    ("Q23", "a"): {"Introversion": 5, "Extroversion": 1, "Social Needs": 1},
    ("Q23", "b"): {"Introversion": 4, "Extroversion": 2, "Social Needs": 2},
    ("Q23", "c"): {"Introversion": 3, "Extroversion": 3, "Social Needs": 3},
    ("Q23", "d"): {"Introversion": 2, "Extroversion": 4, "Social Needs": 4},
    ("Q23", "e"): {"Introversion": 1, "Extroversion": 5, "Social Needs": 5},
    ("Q13", "a"): {"Cleanliness": 5}, ("Q13", "b"): {"Cleanliness": 3}, ("Q13", "c"): {"Cleanliness": 1},
    ("Q14", "a"): {"Caregiving": 5}, ("Q14", "b"): {"Caregiving": 4}, ("Q14", "c"): {"Caregiving": 3}, ("Q14", "d"): {"Caregiving": 1},
    ("Q22", "a"): {"Guest Tolerance": 5}, ("Q22", "b"): {"Guest Tolerance": 3}, ("Q22", "c"): {"Guest Tolerance": 1},
    ("Q11", "a"): {"Sleep Schedule": 1}, ("Q11", "b"): {"Sleep Schedule": 2}, ("Q11", "c"): {"Sleep Schedule": 3}, ("Q11", "d"): {"Sleep Schedule": 5},
    ("Q10", "a"): {"Work Rhythm": 2}, ("Q10", "b"): {"Work Rhythm": 3}, ("Q10", "c"): {"Work Rhythm": 4}, ("Q10", "d"): {"Work Rhythm": 3},
    ("Q19", "a"): {"Flexibility": 5}, ("Q19", "b"): {"Flexibility": 3}, ("Q19", "c"): {"Flexibility": 1},
    ("Q26", "any"): {"Sensitivity": 4}, ("Q26", "none"): {"Sensitivity": 2},
    ("Q24", "d"): {"Flexibility": 4},
    ("Q21", "a"): {"Guest Tolerance": 1}, ("Q21", "b"): {"Guest Tolerance": 3}, ("Q21", "c"): {"Guest Tolerance": 4}, ("Q21", "d"): {"Guest Tolerance": 5},
    ("Q9", "f"): {"Extroversion": 1, "Energy": 5}, ("Q9", "p"): {"Creativity": 5}, ("Q9", "s"): {"Introversion": 4},
    ("Q9", "r"): {"Adaptability": 3}, ("Q9", "m"): {"Caregiving": 4}, ("Q9", "h"): {"Sensitivity": 4}
}

def build_user_trait_vector(user_answers):
    user_vector = {trait: [] for trait in fomi_profiles.columns}
    for q_key, ans in user_answers.items():
        trait_contributions = qa_to_trait_map.get((q_key, ans), {})
        if q_key == "Q26":
            trait_contributions = qa_to_trait_map[("Q26", "none" if ans == "none" else "any")]
        for trait in user_vector:
            if trait in trait_contributions:
                user_vector[trait].append(trait_contributions[trait])
    return np.array([
        np.mean(user_vector[trait]) if user_vector[trait] else 3
        for trait in fomi_profiles.columns
    ])

def match_fomi(user_answers):
    user_vector = build_user_trait_vector(user_answers)
    distances = {
        fomi: np.linalg.norm(user_vector - profile.to_numpy())
        for fomi, profile in fomi_profiles.iterrows()
    }
    return min(distances, key=distances.get)