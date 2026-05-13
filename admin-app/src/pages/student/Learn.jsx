import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const data = {
  Physics: {
    icon: "/physicslogo.jpeg",
    accent: "#C2410C",
    bg: "#FFF7ED",
    tag: "Science",
    chapters: {
      "1. Physical World": {
        subtopics: [
          { name: "Physics and Scientific Method", video: "https://youtu.be/UZtqpRIiKTk?si=A2Xdsbr0h6Lu4cAd" },
          { name: "Scope and Excitement of Physics", video: "https://youtu.be/RcEvEjtsPXI?si=P9cGhht3lTWnN_ln" },
          { name: "Force in Physics", video: "https://youtu.be/kIwkbAaGnKw?si=gXgRAzmw3VOYx5hq" },
          { name: "Gravitational Force", video: "https://youtu.be/_Wb5Oq7b2kU?si=nWIlqFYoYitDc3cW" },
          { name: "Electromagnetic Force", video: "https://youtu.be/IpBWI86hoQ0?si=dYcfPo0MgYsLwyfS" },
          { name: "Nuclear Long and Short Force", video: "https://youtu.be/rlxKAOLrbDY?si=pn56_mTvEys4C2_i" },
        ]
      },
      "2. Physical World, Units and Measurements": {
        subtopics: [
          { name: "Types of Unit and SI Unit", video: "https://youtu.be/Rmy85_EwL0Y?si=vKs8sIv4lZubIcDj" },
          { name: "Length Measurements and Parallax Method", video: "https://youtu.be/I23HvdjDhc8?si=4bxvWQLndP5gL0AS" },
          { name: "Range of Length and Problems", video: "https://youtu.be/GZ0gHiTjZqM?si=SOVjuzB841aLwVV8" },
          { name: "Mass Time Measurements and Accuracy Precision", video: "https://youtu.be/zogKHNdezPk?si=8PbLNCfkqbXcm5Hx" },
          { name: "Types of Errors", video: "https://youtu.be/n0EydO6sEqI?si=Z56GkQUYwaP7T93p" },
          { name: "More Types of Error", video: "https://youtu.be/R9C8H4uOKXk?si=lFxMMyq6DSdGAkn7" },
          { name: "Error Rules and Numericals", video: "https://youtu.be/JJDT2x-Tvg0?si=4JSf-zaywEiP0ujW" },
          { name: "Significant Figures and Ambiguities", video: "https://youtu.be/P0fI53svHDE?si=3rZZN1SkX_SYyfeQ" },
          { name: "Scientific Notation and Rounding Off", video: "https://youtu.be/qXYoV0hFDS8?si=3POcyrN7XUqUzrA-" },
          { name: "Dimensions of Physical Quantities", video: "https://youtu.be/xp_W3gkoZK4?si=NRzaxL6qtEkCt7BE" },
        ]
      },
      "3. Motion in a Straight Line": {
        subtopics: [
          { name: "Rectilinear Motion", video: "https://youtu.be/lAcLN9uDsbY?si=qzlF4uVVb_tOJyCv" },
          { name: "Scalars, Vectors, Distance and Displacement", video: "https://youtu.be/oFwBPis7OaY?si=iVR2Du9YqFyI1N2w" },
          { name: "Speed and Velocity", video: "https://youtu.be/zNaQ8IB1PZA?si=Z8d7tnJj5R_kI8bV" },
          { name: "Distance–Time Graph", video: "https://youtu.be/dOTdUk-rPVM?si=jln8lGRV3O7KWUp7" },
          { name: "Position–Time Graph", video: "https://youtu.be/JajFfPeEZXI?si=2MWy1C_E6SNGcvoY" },
          { name: "Average Speed and Instantaneous Speed", video: "https://youtu.be/0rUb4xTmKzg?si=ZjE1a0wW8fCHLGvK" },
          { name: "Average Velocity and Instantaneous Velocity", video: "https://youtu.be/LXzlB7Lr9f8?si=GAaQ1z7M0nJHUxvw" },
          { name: "Acceleration", video: "https://youtu.be/TiqIgaRIqVw?si=8M-K9F-HudkLbZhK" },
          { name: "Kinematic Equations", video: "https://youtu.be/tWJlBzHXa10?si=SZWfphSS9b5iAU5R" },
          { name: "Relative Velocity", video: "https://youtu.be/TdepXP3f0gk?si=lOkIHDal7RDB4zr6" },
        ]
      },
      "4. Motion in a Plane": { subtopics: [{ name: "Vectors and Scalars", video: "https://youtu.be/example6" }, { name: "Projectile Motion", video: "https://youtu.be/example7" }, { name: "Circular Motion", video: "https://youtu.be/example8" }] },
      "5. Laws of Motion": { subtopics: [{ name: "Newton's First Law", video: "https://youtu.be/example9" }, { name: "Newton's Second Law", video: "https://youtu.be/example10" }, { name: "Newton's Third Law", video: "https://youtu.be/example11" }, { name: "Friction", video: "https://youtu.be/example12" }] },
      "6. Work, Energy and Power": { subtopics: [{ name: "Work Done by a Force", video: "https://youtu.be/example13" }, { name: "Kinetic Energy", video: "https://youtu.be/example14" }, { name: "Potential Energy", video: "https://youtu.be/example15" }, { name: "Conservation of Energy", video: "https://youtu.be/example16" }] },
      "7. System of Particles and Rotational Motion": { subtopics: [{ name: "Centre of Mass", video: "https://youtu.be/example18" }, { name: "Torque and Angular Momentum", video: "https://youtu.be/example19" }, { name: "Moment of Inertia", video: "https://youtu.be/example20" }] },
      "8. Gravitation": { subtopics: [{ name: "Kepler's Laws", video: "https://youtu.be/example21" }, { name: "Universal Law of Gravitation", video: "https://youtu.be/example22" }, { name: "Orbital Speed and Escape Speed", video: "https://youtu.be/example24" }] },
      "9. Mechanical Properties of Solids": { subtopics: [{ name: "Stress and Strain", video: "https://youtu.be/example25" }, { name: "Elastic Moduli", video: "https://youtu.be/example26" }] },
      "10. Mechanical Properties of Fluids": { subtopics: [{ name: "Pressure", video: "https://youtu.be/example28" }, { name: "Bernoulli's Principle", video: "https://youtu.be/example29" }, { name: "Viscosity", video: "https://youtu.be/example30" }] },
      "11. Thermal Properties of Matter": { subtopics: [{ name: "Temperature and Heat", video: "https://youtu.be/example32" }, { name: "Thermal Expansion", video: "https://youtu.be/example33" }] },
      "12. Thermodynamics": { subtopics: [{ name: "First Law of Thermodynamics", video: "https://youtu.be/example37" }, { name: "Second Law of Thermodynamics", video: "https://youtu.be/example38" }] },
      "13. Kinetic Theory": { subtopics: [{ name: "Kinetic Theory of Gases", video: "https://youtu.be/example40" }, { name: "RMS Speed", video: "https://youtu.be/example41" }] },
      "14. Oscillations": { subtopics: [{ name: "Simple Harmonic Motion", video: "https://youtu.be/example44" }, { name: "Damped Oscillations", video: "https://youtu.be/example45" }] },
      "15. Waves": { subtopics: [{ name: "Transverse and Longitudinal Waves", video: "https://youtu.be/example46" }, { name: "Doppler Effect", video: "https://youtu.be/example49" }] },
    }
  },
  Chemistry: {
    icon: "/chemistrylogo.jpeg",
    accent: "#0D9488",
    bg: "#F0FDFA",
    tag: "Science",
    chapters: {
      "1. Some Basic Concepts of Chemistry": {
        subtopics: [
          { name: "Introduction to Chemistry", video: "https://youtu.be/-4VkD9vIW7A?si=ewxxVXfQEzd7KF-D" },
          { name: "States of Matter", video: "https://youtu.be/wodjPyAVNl8?si=8I0eONSenZP7J8ZT" },
          { name: "Mixtures and Pure Substances", video: "https://youtu.be/4wykXCZ2UKw?si=2c9za9WNfJ-fQv6q" },
          { name: "Physical and Chemical Properties", video: "https://youtu.be/wLaxEbZcXzw?si=0stE-dp2MQmNaNzr" },
          { name: "SI Units", video: "https://youtu.be/6KkSiKVc57I?si=JwuAN3hK-kh5V8S5" },
          { name: "Reference Standards", video: "https://youtu.be/lUjNy-HSlh8?si=draNlP_jlr7uLE2A" },
          { name: "Uncertainty in Measurement", video: "https://youtu.be/qLFJvoC4elU?si=UY5-Vye8NyzBi9sv" },
          { name: "Significant Figures", video: "https://youtu.be/Pn1S_p4q32Y?si=pDCrBDFBjVHQnL2K" },
          { name: "Laws of Chemical Combination", video: "https://youtu.be/KZ5ufacSplw?si=RjPkUgZpj5Sz3T9U" },
          { name: "Dalton's Atomic Theory", video: "https://youtu.be/UK1T07khxzQ?si=UHaJhykUB2Xg7Bvk" },
          { name: "Atomic Mass", video: "https://youtu.be/2F-gjC4KU98?si=xSp7ZWxD62cU571-" },
          { name: "Mole Concept", video: "https://youtu.be/eD35Rha8TGM?si=19b1za-ul4HoQIFE" },
          { name: "Empirical Formula and Molecular Formula", video: "https://youtu.be/9mHtlOhrlLY?si=IaayBBqPURn_qTzz" },
          { name: "Stoichiometry", video: "https://youtu.be/jq7ryHuCXbY?si=ieAz-PxBGKCLvPh-" },
          { name: "Limiting Reagent", video: "https://youtu.be/zSr1OfTfzCE?si=HtUmUHGxzeNbMgZ8" },
          { name: "Numericals on Limiting Reagent", video: "https://youtu.be/EPwzFpHTJ8Y?si=F0cnbllJpgnteyMZ" },
          { name: "Molality and Molarity", video: "https://youtu.be/b8MFbEFgryQ?si=IwV_So243QIwct1N" },
          { name: "Practice Numericals – Part 1", video: "https://youtu.be/-duzo7_Qk_k?si=Dm7h0J-yBmojI-WA" },
          { name: "Practice Numericals – Part 2", video: "https://youtu.be/kFAfL-5MiJs?si=Z5oAF9zRDHizo9yi" },
          { name: "Practice Numericals – Part 3", video: "https://youtu.be/c6QL0-QirzA?si=SqR_b4xy5Ggd58Yy" },
          { name: "Practice Numericals – Part 4", video: "https://youtu.be/GnCx8_cWrCo?si=8DEEgRLInHZcC5Kh" },
        ]
      },
      "2. Structure of Atom": { subtopics: [{ name: "Atomic Models – Thomson and Rutherford", video: "https://youtu.be/chem5" }, { name: "Bohr's Model of Hydrogen Atom", video: "https://youtu.be/chem6" }, { name: "Quantum Numbers", video: "https://youtu.be/chem7" }, { name: "Electronic Configuration", video: "https://youtu.be/chem8" }] },
      "3. Classification of Elements and Periodicity": { subtopics: [{ name: "History of Periodic Table", video: "https://youtu.be/chem10" }, { name: "Modern Periodic Law", video: "https://youtu.be/chem11" }, { name: "Periodic Trends – Atomic Radius", video: "https://youtu.be/chem12" }] },
      "4. Chemical Bonding and Molecular Structure": { subtopics: [{ name: "Ionic or Electrovalent Bond", video: "https://youtu.be/chem15" }, { name: "Covalent Bond", video: "https://youtu.be/chem16" }, { name: "VSEPR Theory", video: "https://youtu.be/chem17" }, { name: "Hybridisation", video: "https://youtu.be/chem19" }] },
      "5. States of Matter": { subtopics: [{ name: "Intermolecular Forces", video: "https://youtu.be/chem21" }, { name: "Gas Laws", video: "https://youtu.be/chem22" }, { name: "Ideal Gas Equation", video: "https://youtu.be/chem23" }] },
      "6. Thermodynamics": { subtopics: [{ name: "First Law of Thermodynamics", video: "https://youtu.be/chem27" }, { name: "Enthalpy and Hess's Law", video: "https://youtu.be/chem28" }, { name: "Gibbs Energy and Spontaneity", video: "https://youtu.be/chem30" }] },
      "7. Equilibrium": { subtopics: [{ name: "Law of Chemical Equilibrium", video: "https://youtu.be/chem32" }, { name: "Le Chatelier's Principle", video: "https://youtu.be/chem33" }, { name: "Ionic Equilibrium – Acids and Bases", video: "https://youtu.be/chem34" }] },
      "8. Redox Reactions": { subtopics: [{ name: "Oxidation and Reduction", video: "https://youtu.be/chem36" }, { name: "Oxidation Number", video: "https://youtu.be/chem37" }, { name: "Balancing Redox Equations", video: "https://youtu.be/chem38" }] },
      "9. Hydrogen": { subtopics: [{ name: "Preparation and Properties of Hydrogen", video: "https://youtu.be/chem41" }, { name: "Water and Hydrogen Peroxide", video: "https://youtu.be/chem42" }] },
      "10. The s-Block Elements": { subtopics: [{ name: "Group 1 – Alkali Metals", video: "https://youtu.be/chem44" }, { name: "Group 2 – Alkaline Earth Metals", video: "https://youtu.be/chem46" }] },
      "11. The p-Block Elements": { subtopics: [{ name: "Group 13 – Boron Family", video: "https://youtu.be/chem49" }, { name: "Group 14 – Carbon Family", video: "https://youtu.be/chem50" }, { name: "Allotropes of Carbon", video: "https://youtu.be/chem51" }] },
      "12. Organic Chemistry – Basic Principles": { subtopics: [{ name: "IUPAC Nomenclature", video: "https://youtu.be/chem54" }, { name: "Isomerism", video: "https://youtu.be/chem55" }, { name: "Electronic Displacement Effects", video: "https://youtu.be/chem56" }] },
      "13. Hydrocarbons": { subtopics: [{ name: "Alkanes – Classification and Properties", video: "https://youtu.be/chem58" }, { name: "Alkenes – Structure and Reactions", video: "https://youtu.be/chem59" }, { name: "Aromatic Hydrocarbons – Benzene", video: "https://youtu.be/chem61" }] },
      "14. Environmental Chemistry": { subtopics: [{ name: "Environmental Pollution", video: "https://youtu.be/chem63" }, { name: "Atmospheric Pollution", video: "https://youtu.be/chem64" }, { name: "Green Chemistry", video: "https://youtu.be/chem67" }] },
    }
  },
  Biology: {
    icon: "/biologylogo.jpeg",
    accent: "#15803D",
    bg: "#F0FDF4",
    tag: "Science",
    chapters: {
      "1. The Living World": {
        subtopics: [
          { name: "Introduction to the Living World", video: "https://youtu.be/KGRCtul7B5U?si=7nvhb3zUVmxdNVUu" },
          { name: "Growth as a Characteristic of Living Organisms", video: "https://youtu.be/k8eeyVI1FLA?si=M_xW-DmAWIgbXVhg" },
          { name: "Reproduction", video: "https://youtu.be/DSLxLwNRDcA?si=QqvavuE9A-mQW4JE" },
          { name: "Metabolism", video: "https://youtu.be/Agzwo2w0_Ug?si=EiOFyqxTPQEcDDYw" },
          { name: "Cellular Organization and Consciousness", video: "https://youtu.be/iIKejTt_SMY?si=uAMU96HKHFiezOmR" },
          { name: "Biodiversity, Nomenclature and Identification", video: "https://youtu.be/iIKejTt_SMY?si=qKzT7Lxkz0Z-uEZz" },
          { name: "Classification and Its Need", video: "https://youtu.be/9VvBKcoshAY?si=rJ45d6wMBErmTLrv" },
          { name: "Taxa, Taxonomy and Taxonomic Hierarchy", video: "https://youtu.be/RGFgMiPOdR8?si=qYVfaLe-hM66bPjo" },
          { name: "Species, Genus and Family", video: "https://youtu.be/ZRyhs4lrqI0?si=LPtyKG2NhxOTtjYl" },
          { name: "Order, Class, Phylum/Division and Kingdom", video: "https://youtu.be/3oeoHjO1ZAE?si=Y2ef2izZpRShzl6g" },
          { name: "Taxonomical Aids", video: "https://youtu.be/GeJdgeF4XCI?si=RhjKkJdOqdO55JnK" },
          { name: "Problems, Questions and Practice Exercises", video: "https://youtu.be/knXAWd-xF2Q?si=vbi6Q2TzlvKLX4Q0" },
        ]
      },
      "2. Biological Classification": { subtopics: [{ name: "Kingdom Monera", video: "https://youtu.be/bio5" }, { name: "Kingdom Protista", video: "https://youtu.be/bio6" }, { name: "Kingdom Fungi", video: "https://youtu.be/bio7" }, { name: "Viruses, Viroids and Lichens", video: "https://youtu.be/bio9" }] },
      "3. Plant Kingdom": { subtopics: [{ name: "Algae", video: "https://youtu.be/bio10" }, { name: "Bryophytes", video: "https://youtu.be/bio11" }, { name: "Gymnosperms", video: "https://youtu.be/bio13" }, { name: "Angiosperms and Plant Life Cycles", video: "https://youtu.be/bio14" }] },
      "4. Animal Kingdom": { subtopics: [{ name: "Phylum Porifera to Echinodermata", video: "https://youtu.be/bio16" }, { name: "Phylum Chordata", video: "https://youtu.be/bio17" }, { name: "Class Aves and Mammalia", video: "https://youtu.be/bio19" }] },
      "5. Morphology of Flowering Plants": { subtopics: [{ name: "The Root and Stem", video: "https://youtu.be/bio20" }, { name: "The Flower", video: "https://youtu.be/bio22" }, { name: "The Fruit and Seed", video: "https://youtu.be/bio23" }] },
      "6. Anatomy of Flowering Plants": { subtopics: [{ name: "The Tissues", video: "https://youtu.be/bio25" }, { name: "Anatomy of Dicot and Monocot Plants", video: "https://youtu.be/bio27" }, { name: "Secondary Growth", video: "https://youtu.be/bio28" }] },
      "7. Structural Organisation in Animals": { subtopics: [{ name: "Animal Tissues – Epithelial and Connective", video: "https://youtu.be/bio29" }, { name: "Muscle and Neural Tissue", video: "https://youtu.be/bio30" }, { name: "Earthworm, Cockroach and Frog", video: "https://youtu.be/bio32" }] },
      "8. Cell: The Unit of Life": { subtopics: [{ name: "Cell Theory and Overview", video: "https://youtu.be/bio33" }, { name: "Prokaryotic Cell", video: "https://youtu.be/bio34" }, { name: "Eukaryotic Cell Organelles", video: "https://youtu.be/bio36" }] },
      "9. Biomolecules": { subtopics: [{ name: "Proteins and Enzymes", video: "https://youtu.be/bio40" }, { name: "Polysaccharides and Nucleic Acids", video: "https://youtu.be/bio41" }] },
      "10. Cell Cycle and Cell Division": { subtopics: [{ name: "Cell Cycle", video: "https://youtu.be/bio42" }, { name: "Mitosis", video: "https://youtu.be/bio43" }, { name: "Meiosis", video: "https://youtu.be/bio44" }] },
      "11. Transport in Plants": { subtopics: [{ name: "Osmosis and Water Potential", video: "https://youtu.be/bio47" }, { name: "Absorption of Water and Ascent of Sap", video: "https://youtu.be/bio48" }] },
      "12. Mineral Nutrition": { subtopics: [{ name: "Essential Mineral Elements", video: "https://youtu.be/bio51" }, { name: "Nitrogen Metabolism", video: "https://youtu.be/bio53" }] },
      "13. Photosynthesis in Higher Plants": { subtopics: [{ name: "Light Reactions", video: "https://youtu.be/bio55" }, { name: "Calvin Cycle – Dark Reactions", video: "https://youtu.be/bio56" }, { name: "Factors Affecting Photosynthesis", video: "https://youtu.be/bio58" }] },
      "14. Respiration in Plants": { subtopics: [{ name: "Glycolysis", video: "https://youtu.be/bio60" }, { name: "Aerobic Respiration – Krebs Cycle", video: "https://youtu.be/bio62" }, { name: "Electron Transport Chain and ATP", video: "https://youtu.be/bio63" }] },
      "15. Plant Growth and Development": { subtopics: [{ name: "Plant Growth Regulators – Auxins, Gibberellins", video: "https://youtu.be/bio65" }, { name: "Photoperiodism and Vernalisation", video: "https://youtu.be/bio67" }] },
      "16. Digestion and Absorption": { subtopics: [{ name: "Alimentary Canal", video: "https://youtu.be/bio68" }, { name: "Digestion of Food", video: "https://youtu.be/bio69" }, { name: "Disorders of Digestive System", video: "https://youtu.be/bio71" }] },
      "17. Breathing and Exchange of Gases": { subtopics: [{ name: "Mechanism of Breathing", video: "https://youtu.be/bio73" }, { name: "Exchange and Transport of Gases", video: "https://youtu.be/bio74" }] },
      "18. Body Fluids and Circulation": { subtopics: [{ name: "Blood and Its Components", video: "https://youtu.be/bio76" }, { name: "Human Circulatory System and Heart", video: "https://youtu.be/bio78" }, { name: "Cardiac Cycle and ECG", video: "https://youtu.be/bio79" }] },
      "19. Excretory Products and their Elimination": { subtopics: [{ name: "Human Excretory System – Kidney", video: "https://youtu.be/bio82" }, { name: "Urine Formation", video: "https://youtu.be/bio83" }] },
      "20. Locomotion and Movement": { subtopics: [{ name: "Skeletal Muscle and Muscle Contraction", video: "https://youtu.be/bio87" }, { name: "Skeletal System", video: "https://youtu.be/bio88" }] },
      "21. Neural Control and Coordination": { subtopics: [{ name: "Neuron and Nerves", video: "https://youtu.be/bio90" }, { name: "Reflex Action", video: "https://youtu.be/bio92" }] },
      "22. Chemical Coordination and Integration": { subtopics: [{ name: "Human Endocrine System", video: "https://youtu.be/bio95" }, { name: "Mechanism of Hormone Action", video: "https://youtu.be/bio97" }] },
    }
  },
  Maths: {
    icon: "/mathslogo.jpeg",
    accent: "#2563EB",
    bg: "#EFF6FF",
    tag: "Mathematics",
    chapters: {
      "1. Sets": {
        subtopics: [
          { name: "Set Concept and Conventions", video: "https://youtu.be/hEgH4Xfgefo?si=uFcA-BZtJcEG3SPT" },
          { name: "Roster Form and Set-Builder Form", video: "https://youtu.be/JsMTPYD7Oj4?si=Fs8wddRJQ28uToNS" },
          { name: "Examples of Roster Form and Set-Builder Form", video: "https://youtu.be/wfZIhBrbp5Q?si=fYD20kh7RJw9bbmj" },
          { name: "Empty Set, Finite Set and Infinite Set", video: "https://youtu.be/-3HFgqEnPDw?si=hoWdrbjo5kywHUhp" },
          { name: "Equal Sets", video: "https://youtu.be/kxYF1ysWYLc?si=UpHUu2L_463T9QM7" },
          { name: "Subsets and Supersets", video: "https://youtu.be/2ZvBOun7Soo?si=F9k2mHw5skKKE72f" },
          { name: "Singleton Set, Power Set and Universal Set", video: "https://youtu.be/qDS0yutMqeA?si=X9fVQw0qERN7IfGY" },
          { name: "Open and Closed Intervals", video: "https://youtu.be/k-rfkCI3nAA?si=hNmiRVvbcxZuCduM" },
          { name: "Venn Diagram – Concept", video: "https://youtu.be/VkVA0A-zQpo?si=jxweFeH5trx-hOP1" },
          { name: "Union of Sets", video: "https://youtu.be/YHe4fE3d6lI?si=Qws9JWGlnolZhQPz" },
          { name: "Intersection of Sets", video: "https://youtu.be/9QW906yiHdQ?si=rpfF4zrJU2mtLvag" },
          { name: "Difference and Complement of Sets", video: "https://youtu.be/XQpI1JTVuos?si=_CIeE7zzobIAMXuU" },
          { name: "Venn Diagram – Practice", video: "https://youtu.be/qF27zlHjkTs?si=tFGHM5OQ9UPHL2NN" },
          { name: "Element Count – Concept", video: "https://youtu.be/EGfTZw6yC64?si=M4hqcNIpo7GoDyRT" },
          { name: "Element Count Problems and Summary", video: "https://youtu.be/UxoYnNdFoY8?si=ltcM8zaBzDpyHeBN" },
        ]
      },
      "2. Relations and Functions": { subtopics: [{ name: "Ordered Pairs and Cartesian Product", video: "https://youtu.be/math6" }, { name: "Types of Functions", video: "https://youtu.be/math8" }, { name: "Algebra of Real Functions", video: "https://youtu.be/math9" }] },
      "3. Trigonometric Functions": { subtopics: [{ name: "Angles – Degree and Radian", video: "https://youtu.be/math10" }, { name: "Trigonometric Identities", video: "https://youtu.be/math12" }, { name: "Trigonometric Equations", video: "https://youtu.be/math14" }] },
      "4. Principle of Mathematical Induction": { subtopics: [{ name: "Introduction and Motivation", video: "https://youtu.be/math15" }, { name: "The Principle of Mathematical Induction", video: "https://youtu.be/math16" }] },
      "5. Complex Numbers and Quadratic Equations": { subtopics: [{ name: "Introduction to Complex Numbers", video: "https://youtu.be/math18" }, { name: "Modulus and Conjugate", video: "https://youtu.be/math20" }, { name: "Argand Plane and Polar Form", video: "https://youtu.be/math21" }] },
      "6. Linear Inequalities": { subtopics: [{ name: "Algebraic Solutions of Linear Inequalities", video: "https://youtu.be/math24" }, { name: "Graphical Solution of Linear Inequalities", video: "https://youtu.be/math25" }] },
      "7. Permutations and Combinations": { subtopics: [{ name: "Fundamental Principle of Counting", video: "https://youtu.be/math27" }, { name: "Permutations", video: "https://youtu.be/math28" }, { name: "Combinations", video: "https://youtu.be/math29" }] },
      "8. Binomial Theorem": { subtopics: [{ name: "Binomial Theorem for Positive Integral Indices", video: "https://youtu.be/math31" }, { name: "General and Middle Term", video: "https://youtu.be/math33" }] },
      "9. Sequences and Series": { subtopics: [{ name: "Arithmetic Progression (AP)", video: "https://youtu.be/math36" }, { name: "Geometric Progression (GP)", video: "https://youtu.be/math37" }, { name: "Sum to n Terms of Special Series", video: "https://youtu.be/math39" }] },
      "10. Straight Lines": { subtopics: [{ name: "Slope of a Line", video: "https://youtu.be/math40" }, { name: "Various Forms of Equation of a Line", video: "https://youtu.be/math41" }, { name: "Distance of a Point from a Line", video: "https://youtu.be/math43" }] },
      "11. Conic Sections": { subtopics: [{ name: "Circle", video: "https://youtu.be/math45" }, { name: "Parabola", video: "https://youtu.be/math46" }, { name: "Ellipse", video: "https://youtu.be/math47" }, { name: "Hyperbola", video: "https://youtu.be/math48" }] },
      "12. Introduction to Three Dimensional Geometry": { subtopics: [{ name: "Coordinate Axes and Planes in 3D", video: "https://youtu.be/math49" }, { name: "Distance between Two Points", video: "https://youtu.be/math51" }] },
      "13. Limits and Derivatives": { subtopics: [{ name: "Limits", video: "https://youtu.be/math54" }, { name: "Limits of Trigonometric Functions", video: "https://youtu.be/math55" }, { name: "Derivatives", video: "https://youtu.be/math56" }] },
      "14. Mathematical Reasoning": { subtopics: [{ name: "Statements and Their Truth Values", video: "https://youtu.be/math58" }, { name: "Connectives – And, Or, Not", video: "https://youtu.be/math59" }, { name: "Validating Statements", video: "https://youtu.be/math61" }] },
      "15. Statistics": { subtopics: [{ name: "Measures of Dispersion", video: "https://youtu.be/math62" }, { name: "Variance and Standard Deviation", video: "https://youtu.be/math64" }] },
      "16. Probability": { subtopics: [{ name: "Random Experiments and Sample Space", video: "https://youtu.be/math66" }, { name: "Axiomatic Approach to Probability", video: "https://youtu.be/math68" }, { name: "Problems on Probability", video: "https://youtu.be/math70" }] },
    }
  },
};

function getYoutubeEmbedUrl(url) {
  try {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  } catch { }
  return url;
}

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default function ClassPortal() {
  const navigate = useNavigate();
  const [view, setView] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const subjectInfo = selectedSubject ? data[selectedSubject] : null;
  const accent = subjectInfo ? subjectInfo.accent : "#6366f1";
  
  const chapterKeys = selectedSubject ? Object.keys(data[selectedSubject].chapters) : [];
  const filteredChapters = chapterKeys.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const goHome = () => { setView("subjects"); setSelectedSubject(null); setSelectedChapter(null); setSelectedSubtopic(null); setSearchQuery(""); };
  const goSubject = () => { setView("chapters"); setSelectedChapter(null); setSelectedSubtopic(null); setSearchQuery(""); };
  const goChapter = () => { setView("subtopics"); setSelectedSubtopic(null); };

  const totalVideos = (subj) => Object.values(data[subj].chapters).reduce((acc, c) => acc + c.subtopics.length, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDFDFD",
      fontFamily: FONT_SANS,
      color: "#0f172a",
      overflowX: "hidden"
    }} className="animate-in fade-in duration-1000">
      
      {/* Mesh Background Effect */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        background: `
          radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(244, 63, 94, 0.05) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.05) 0px, transparent 50%)
        `,
        pointerEvents: "none"
      }} />

      {/* Top Nav */}
      <nav style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            onClick={goHome}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
          >
            <div style={{ 
              background: "linear-gradient(135deg, #6366f1, #a855f7)", 
              width: 32, height: 32, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: "bold"
            }}>XI</div>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>Class Portal</span>
          </div>

          {/* Breadcrumb */}
          <div style={{ 
            display: "flex", alignItems: "center", gap: 12, 
            fontSize: 12, color: "rgba(255,255,255,0.4)", 
            fontWeight: 600, letterSpacing: "0.02em" 
          }}>
            <span onClick={goHome} style={{ cursor: "pointer", transition: "color 0.2s", color: !selectedSubject ? "#fff" : "inherit" }} onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color=""}>HOME</span>
            {selectedSubject && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
                <span
                  onClick={view !== "chapters" ? goSubject : undefined}
                  style={{ cursor: view !== "chapters" ? "pointer" : "default", color: view === "chapters" ? "#fff" : "inherit" }}
                >{selectedSubject.toUpperCase()}</span>
              </>
            )}
            {selectedChapter && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
                <span
                  onClick={view !== "subtopics" ? goChapter : undefined}
                  style={{ 
                    cursor: view !== "subtopics" ? "pointer" : "default", 
                    color: view === "subtopics" ? "#fff" : "inherit", 
                    maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" 
                  }}
                >{selectedChapter.toUpperCase()}</span>
              </>
            )}
          </div>
        </div>

        <div
          onClick={() => navigate('/student')}
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: 10,
            background: "rgba(99, 102, 241, 0.15)",
            padding: "8px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.1em" }}>DASHBOARD</span>
          <ArrowLeft style={{ width: 14, height: 14, color: "#fff", transform: "rotate(180deg)" }} />
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 40px", position: "relative", zIndex: 1 }}>

        {/* SUBJECTS VIEW */}
        {view === "subjects" && (
          <div style={{ opacity: mounted ? 1 : 0, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div style={{ marginBottom: 64, textAlign: "center" }}>
              <div style={{ 
                display: "inline-block",
                fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", color: "#6366f1", 
                textTransform: "uppercase", marginBottom: 16,
                background: "rgba(99, 102, 241, 0.08)",
                padding: "6px 16px", borderRadius: "100px"
              }}>Academic Year 2025–26</div>
              <h1 style={{ 
                fontSize: 56, fontWeight: 900, color: "#0f172a", margin: "0 0 16px", 
                lineHeight: 1.1, tracking: "-0.04em", letterSpacing: "-0.04em"
              }}>
                Sapthagiri <span style={{ color: "#6366f1" }}>XI</span> Portal
              </h1>
              <p style={{ fontSize: 18, color: "#64748b", maxWidth: 600, margin: "0 auto", lineHeight: 1.6, fontWeight: 500 }}>
                High-fidelity educational resources for the future leaders. Select a subject to begin your journey.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 32 }}>
              {Object.entries(data).map(([subject, info], idx) => (
                <div
                  key={subject}
                  onClick={() => { setSelectedSubject(subject); setView("chapters"); }}
                  onMouseEnter={() => setHoveredSubject(subject)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #f1f5f9",
                    borderRadius: 32,
                    padding: "40px",
                    cursor: "pointer",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: hoveredSubject === subject ? "translateY(-12px)" : "none",
                    boxShadow: hoveredSubject === subject 
                      ? `0 30px 60px -12px ${info.accent}20, 0 18px 36px -18px rgba(0,0,0,0.1)` 
                      : "0 10px 20px -5px rgba(0,0,0,0.02)",
                    animation: `cardIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards ${idx * 0.1}s`,
                    opacity: 0,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <style>{`
                    @keyframes cardIn {
                      from { opacity: 0; transform: translateY(40px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  
                  {/* Subject accent light */}
                  <div style={{
                    position: "absolute", top: -40, right: -40, width: 120, height: 120,
                    background: `${info.accent}15`, borderRadius: "50%", blur: "40px", filter: "blur(40px)"
                  }} />

                  <div style={{ 
                    width: 72, height: 72, marginBottom: 32, 
                    borderRadius: 24, overflow: 'hidden',
                    boxShadow: `0 12px 24px -6px ${info.accent}40`,
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: hoveredSubject === subject ? "scale(1.1) rotate(5deg)" : "none",
                  }}>
                    {info.icon.startsWith('/') ? (
                      <img src={info.icon} alt={subject} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: 40, background: info.bg, width: '100%', height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>{info.icon}</div>
                    )}
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", marginBottom: 8, letterSpacing: "-0.02em" }}>{subject}</h3>
                  <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: info.accent, marginBottom: 24 }}>{info.tag}</div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                       <div style={{ width: 4, height: 4, borderRadius: "50%", background: info.accent }} />
                       {Object.keys(info.chapters).length} Chapters
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                       <div style={{ width: 4, height: 4, borderRadius: "50%", background: info.accent }} />
                       {totalVideos(subject)} Lessons
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAPTERS VIEW */}
        {view === "chapters" && selectedSubject && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            
            {/* Subject header */}
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #f1f5f9",
              borderRadius: 40,
              padding: "48px",
              marginBottom: 48,
              boxShadow: "0 20px 40px -20px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <div style={{ 
                  width: 96, height: 96, borderRadius: 28, overflow: 'hidden',
                  boxShadow: `0 20px 40px -10px ${accent}40`
                }}>
                  {subjectInfo.icon.startsWith('/') ? (
                    <img src={subjectInfo.icon} alt={selectedSubject} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: 48, background: subjectInfo.bg, width: '100%', height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>{subjectInfo.icon}</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>{subjectInfo.tag}</div>
                  <h2 style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.04em" }}>{selectedSubject}</h2>
                  <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#64748b", marginTop: 12, fontWeight: 500 }}>
                    <span><strong style={{ color: "#0f172a" }}>{Object.keys(subjectInfo.chapters).length}</strong> Active Chapters</span>
                    <span style={{ color: "#e2e8f0" }}>|</span>
                    <span><strong style={{ color: "#0f172a" }}>{totalVideos(selectedSubject)}</strong> Interactive Lessons</span>
                  </div>
                </div>
              </div>
              
              <div style={{ position: "relative", width: 320 }}>
                <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#94a3b8" }}>⌕</span>
                <input
                  type="text"
                  placeholder="Find a chapter..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 24px 16px 52px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "20px",
                    fontSize: 14,
                    color: "#0f172a",
                    outline: "none",
                    fontWeight: 600,
                    transition: "all 0.3s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = accent;
                    e.target.style.background = "#fff";
                    e.target.style.boxShadow = `0 0 0 4px ${accent}10`;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Chapter list */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              {filteredChapters.map((chapter, i) => {
                const count = subjectInfo.chapters[chapter].subtopics.length;
                return (
                  <div
                    key={chapter}
                    onClick={() => { setSelectedChapter(chapter); setView("subtopics"); }}
                    onMouseEnter={() => setHoveredChapter(chapter)}
                    onMouseLeave={() => setHoveredChapter(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      background: hoveredChapter === chapter ? "#fff" : "transparent",
                      border: "1px solid",
                      borderColor: hoveredChapter === chapter ? "#f1f5f9" : "transparent",
                      borderRadius: 24,
                      padding: "24px 32px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: hoveredChapter === chapter ? "translateX(12px)" : "none",
                      boxShadow: hoveredChapter === chapter ? "0 10px 30px -10px rgba(0,0,0,0.05)" : "none",
                      animation: `listIn 0.5s ease forwards ${i * 0.05}s`,
                      opacity: 0,
                    }}
                  >
                    <style>{`@keyframes listIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
                    <span style={{
                      minWidth: 44, height: 44, borderRadius: 14,
                      background: hoveredChapter === chapter ? accent : "#f1f5f9",
                      color: hoveredChapter === chapter ? "#fff" : "#64748b",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 800,
                      transition: "all 0.3s"
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "#334155" }}>{chapter}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                       <span style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em" }}>{count} LESSONS</span>
                       <div style={{ 
                         width: 32, height: 32, borderRadius: "50%", 
                         background: hoveredChapter === chapter ? accent + "15" : "transparent",
                         display: "flex", alignItems: "center", justifyContent: "center",
                         color: accent, transition: "all 0.3s"
                       }}>
                         <span style={{ fontSize: 20 }}>›</span>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTOPICS VIEW */}
        {view === "subtopics" && selectedSubject && selectedChapter && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button
              onClick={goSubject}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0 40px", marginLeft: -4 }}
              onMouseEnter={e => e.target.style.transform="translateX(-4px)"}
              onMouseLeave={e => e.target.style.transform="translateX(0)"}
            >
              ← Back to {selectedSubject}
            </button>

            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 12 }}>{selectedSubject}</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", margin: "0 0 12px", letterSpacing: "-0.03em" }}>{selectedChapter}</h2>
              <div style={{ 
                display: "inline-block", padding: "6px 14px", borderRadius: "8px", 
                background: "#f1f5f9", color: "#64748b", fontSize: 12, fontWeight: 700 
              }}>
                {subjectInfo.chapters[selectedChapter].subtopics.length} Interactive Lessons
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {subjectInfo.chapters[selectedChapter].subtopics.map((sub, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedSubtopic(sub); setView("video"); }}
                  onMouseEnter={() => setHoveredSub(i)}
                  onMouseLeave={() => setHoveredSub(null)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #f1f5f9",
                    borderRadius: 28,
                    padding: "32px",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    transform: hoveredSub === i ? "translateY(-8px)" : "none",
                    boxShadow: hoveredSub === i ? `0 20px 40px -12px ${accent}25` : "0 4px 6px -1px rgba(0,0,0,0.02)",
                    animation: `popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards ${i * 0.05}s`,
                    opacity: 0,
                  }}
                >
                  <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
                  <div style={{
                    minWidth: 56, height: 56, borderRadius: 20,
                    background: hoveredSub === i ? accent : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: hoveredSub === i ? "#fff" : accent, fontSize: 20, flexShrink: 0,
                    transition: "all 0.3s"
                  }}>▶</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>LESSON {i + 1}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#334155", lineHeight: 1.4 }}>{sub.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO VIEW */}
        {view === "video" && selectedSubtopic && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button
              onClick={goChapter}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0 40px", marginLeft: -4 }}
              onMouseEnter={e => e.target.style.transform="translateX(-4px)"}
              onMouseLeave={e => e.target.style.transform="translateX(0)"}
            >
              ← Back to lessons
            </button>

            <div style={{ 
              background: "#FFFFFF", border: "1px solid #f1f5f9", borderRadius: 48, overflow: "hidden",
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.12)"
            }}>
              {/* Video embed */}
              <div style={{ background: "#000", aspectRatio: "16/9", position: "relative" }}>
                <iframe
                  src={getYoutubeEmbedUrl(selectedSubtopic.video)}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  allowFullScreen
                  title={selectedSubtopic.name}
                />
              </div>

              {/* Video info */}
              <div style={{ padding: "48px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{
                    background: accent + "15",
                    color: accent,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "6px 16px",
                    borderRadius: "100px",
                  }}>{selectedSubject}</span>
                  <span style={{ color: "#e2e8f0" }}>•</span>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{selectedChapter}</span>
                </div>
                <h3 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.03em" }}>{selectedSubtopic.name}</h3>
                <p style={{ fontSize: 16, color: "#64748b", margin: 0, lineHeight: 1.8, fontWeight: 500, maxWidth: 800 }}>
                  Dive deep into this session on <strong style={{ color: "#334155" }}>{selectedSubtopic.name}</strong>. This lesson is carefully curated to align with the Class XI curriculum. Take notes and revisit anytime.
                </p>
              </div>

              {/* Related lessons */}
              {selectedChapter && (() => {
                const allSubs = subjectInfo.chapters[selectedChapter].subtopics;
                const currIdx = allSubs.findIndex(s => s.name === selectedSubtopic.name);
                const next = allSubs[currIdx + 1];
                const prev = allSubs[currIdx - 1];
                if (!next && !prev) return null;
                return (
                  <div style={{ 
                    borderTop: "1px solid #f1f5f9", padding: "32px 48px", 
                    display: "flex", gap: 24, background: "#fcfcfd" 
                  }}>
                    {prev && (
                      <button
                        onClick={() => { setSelectedSubtopic(prev); }}
                        style={{
                          flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24,
                          padding: "20px 28px", cursor: "pointer", textAlign: "left",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor=accent; e.currentTarget.style.transform="translateY(-4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.transform="translateY(0)"; }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>← PREVIOUS LESSON</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#334155" }}>{prev.name}</div>
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => { setSelectedSubtopic(next); }}
                        style={{
                          flex: 1, background: accent, border: "none", borderRadius: 24,
                          padding: "20px 28px", cursor: "pointer", textAlign: "right",
                          transition: "all 0.3s",
                          color: "#fff"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
                        onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
                      >
                        <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>NEXT LESSON →</div>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>{next.name}</div>
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: "center", padding: "64px 40px", 
        fontSize: 12, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em",
        borderTop: "1px solid #f1f5f9", marginTop: 80,
        background: "#fff"
      }}>
        SAPTHAGIRI VIDYALAYA · CLASS XI ACADEMIC PORTAL · 2025
      </footer>
    </div>
  );
}