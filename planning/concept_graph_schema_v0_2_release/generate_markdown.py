
#!/usr/bin/env python3
"""
Generate Quartz/Obsidian-ready Markdown from concept YAML files.
Usage:
  python generate_markdown.py concepts/ output_md/
"""

import os, sys, yaml

def render(concept):
    lines = []
    lines.append('---')
    lines.append(f"id: {concept['id']}")
    lines.append("tags:")
    for domain, level in concept.get('tags', {}).items():
        lines.append(f"  {domain}: {level}")
    lines.append(f"maturity: {concept.get('maturity', {}).get('level', '')}")
    lines.append('---\n')

    lines.append(f"# {concept['name']}\n")
    lines.append(concept.get('summary', '') + "\n")

    if 'description' in concept:
        lines.append("## Description")
        lines.append(concept['description'] + "\n")

    if concept.get('assumptions'):
        lines.append("## Assumptions")
        for a in concept['assumptions']:
            lines.append(f"- {a}")
        lines.append("")

    if concept.get('downstream_impacts'):
        lines.append("## Downstream Impacts")
        for d in concept['downstream_impacts']:
            lines.append(f"- [[{d}]]")
        lines.append("")

    if concept.get('anti_patterns'):
        lines.append("## Anti-Patterns")
        for ap in concept['anti_patterns']:
            lines.append(f"- {ap}")
        lines.append("")

    if concept.get('notes'):
        lines.append("## Notes")
        for n in concept['notes']:
            lines.append(f"- {n}")
        lines.append("")

    return "\n".join(lines)

def main(src, dst):
    os.makedirs(dst, exist_ok=True)
    for fn in os.listdir(src):
        if not fn.endswith(".yaml"):
            continue
        with open(os.path.join(src, fn)) as f:
            concept = yaml.safe_load(f)
        md = render(concept)
        out = os.path.join(dst, concept['id'] + ".md")
        with open(out, "w") as f:
            f.write(md)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_markdown.py <concept_yaml_dir> <output_md_dir>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
