from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def find_best_matches(profiles_dict):
    names = list(profiles_dict.keys())
    descriptions = list(profiles_dict.values())

    embeddings = model.encode(descriptions, convert_to_tensor=True)
    similarity_matrix = util.pytorch_cos_sim(embeddings, embeddings)

    match_results = {}
    for i in range(len(names)):
        scores = similarity_matrix[i]
        best_match_idx = (scores.argsort(descending=True)[1]).item()
        match_results[names[i]] = {
            "match_with": names[best_match_idx],
            "score": float(scores[best_match_idx])
        }
    return match_results


def find_similarity_matrix(profiles_dict):
    names = list(profiles_dict.keys())
    descriptions = list(profiles_dict.values())

    embeddings = model.encode(descriptions, convert_to_tensor=True)
    similarity_matrix = util.pytorch_cos_sim(embeddings, embeddings)

    # 유사도 결과를 딕셔너리로 변환
    result = {}
    for i, name_i in enumerate(names):
        result[name_i] = {}
        for j, name_j in enumerate(names):
            result[name_i][name_j] = round(similarity_matrix[i][j].item(), 4)  # 소수점 4자리
    return result
