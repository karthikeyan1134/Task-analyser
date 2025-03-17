from transformers import pipeline

def is_job_related(text):
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    labels = ["job opportunity", "internship", "placement", "not related"]
    result = classifier(text, candidate_labels=labels)
    
    if result["labels"][0] in ["job opportunity", "internship", "placement"]:
        return 1
    return 0

# Example usage
text = "We are looking for software engineering interns for our summer program."
print(is_job_related(text))  # Output: 1
