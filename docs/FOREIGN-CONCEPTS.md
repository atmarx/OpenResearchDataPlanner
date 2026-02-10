Acronyms That Need Definitions
Infrastructure:
HPC - Tonsley: "what does HPC mean?"
GPU - Tonsley: "I don't know what a GPU is"
SLURM - (less technical users won't know)
VDI - Virtual Desktop Infrastructure
K8s - Kubernetes
Compliance (acronym soup):
PHI - Tonsley: "I don't know what PHI is"
HIPAA - familiar to some, not all
IRB - Institutional Review Board
FERPA - student data privacy
FISMA / CUI - Tonsley: "I don't know what any of those acronyms mean"
ITAR / EAR - export controls
BAA - Frindt: "Does Northwinds have BAAs with Azure?"
FDA 21 CFR Part 11 - Frindt needed this explicitly
Programs:
ACCESS - Vex noted it should be shouted from the rooftops
Concepts That Need Examples
Concept	Concrete Example Needed
Tier selection	"Medieval manuscript photos of public domain works = Low tier"
Archive vs Active	"Active = files on your desk. Archive = files in the attic."
Preemptible/Scavenger	"Free but your job might get bumped. Good for: checkpointable ML. Bad for: 48-hour continuous runs"
Snapshots	"Like Time Machine - we keep copies from the last 30 days"
Workload-to-Resource Examples
This is where you can really help people estimate: Storage (photos/files → TB):
1 TB ≈ 200,000 high-res photos (5MB each)
1 TB ≈ 500,000 document scans
1 TB ≈ 250 hours of HD video
1 whole-genome sequence ≈ 100-200 GB raw
Compute (task → SU/GPU-hours):
1 WGS alignment pipeline ≈ 5,000 SU
1 hour of LAMMPS (1M atoms, 64 cores) ≈ 64 SU
Fine-tuning a 7B LLM ≈ 500-2,000 GPU-hours
Training a vision model (ResNet-50) ≈ 100 GPU-hours
ANSYS FEA simulation (medium mesh) ≈ 200-500 GPU-hours
ACCESS credits:
1 credit ≈ 1 core-hour on Expanse (SDSC)
1 A100 GPU-hour on Delta ≈ 4 credits
A typical PhD thesis project ≈ 100K-500K credits
Things People Wished Were Explained
From Tonsley specifically:
"What I desperately need here: '1 terabyte (TB) is about 1,000 gigabytes (GB), which is roughly 200,000 high-resolution photos.' With that sentence, I could figure it out. Without it, I'm completely stuck."
From Vex:
"Why force me to pick a start date when it's irrelevant to the cost calculation? Just let me say '3 years' and be done with it."
From Transom:
"I had to manually do my own math to figure out what [AWS presets] translate to in actual GPU time."
Bottom line: The "Help Me Estimate" page should have:
Unit converter (photos → TB, workflow → SUs)
Inline acronym definitions
Tier decision tree with discipline-specific examples
Workload presets by field (genomics, ML, simulation, humanities archives)