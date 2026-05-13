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

const FONT = "'Georgia', 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

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

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const subjectInfo = selectedSubject ? data[selectedSubject] : null;
  const accent = subjectInfo ? subjectInfo.accent : "#1E3A5F";
  const bg = subjectInfo ? subjectInfo.bg : "#F8F7F4";

  const chapterKeys = selectedSubject ? Object.keys(data[selectedSubject].chapters) : [];
  const filteredChapters = chapterKeys.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const goHome = () => { setView("subjects"); setSelectedSubject(null); setSelectedChapter(null); setSelectedSubtopic(null); setSearchQuery(""); };
  const goSubject = () => { setView("chapters"); setSelectedChapter(null); setSelectedSubtopic(null); setSearchQuery(""); };
  const goChapter = () => { setView("subtopics"); setSelectedSubtopic(null); };

  const totalVideos = (subj) => Object.values(data[subj].chapters).reduce((acc, c) => acc + c.subtopics.length, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAF8",
      fontFamily: FONT,
    }} className="animate-in fade-in duration-700">
      {/* Top nav */}
      <nav style={{
        background: "#1E3A5F",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        gap: 0,
        borderBottom: "1px solid #162D4A",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            onClick={goHome}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.04em", fontFamily: MONO }}>CLASS XI</span>
            <span style={{ width: 1, height: 20, background: "#2C5280", margin: "0 16px" }} />
          </div>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.55)", fontFamily: "'Helvetica Neue', sans-serif" }}>
            <span onClick={goHome} style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>Home</span>
            {selectedSubject && (
              <>
                <span style={{ opacity: 0.4 }}>/</span>
                <span
                  onClick={view !== "chapters" ? goSubject : undefined}
                  style={{ cursor: view !== "chapters" ? "pointer" : "default", color: view === "chapters" ? "#fff" : "rgba(255,255,255,0.7)" }}
                >{selectedSubject}</span>
              </>
            )}
            {selectedChapter && (
              <>
                <span style={{ opacity: 0.4 }}>/</span>
                <span
                  onClick={view !== "subtopics" ? goChapter : undefined}
                  style={{ cursor: view !== "subtopics" ? "pointer" : "default", color: view === "subtopics" ? "#fff" : "rgba(255,255,255,0.7)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >{selectedChapter}</span>
              </>
            )}
            {selectedSubtopic && (
              <>
                <span style={{ opacity: 0.4 }}>/</span>
                <span style={{ color: "#fff", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedSubtopic.name}</span>
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
            gap: 8,
            background: "rgba(255,255,255,0.05)",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.08em", fontFamily: "'Helvetica Neue', sans-serif" }}>DASHBOARD</span>
          <ArrowLeft style={{ width: 14, height: 14, color: "#FFFFFF", opacity: 0.8, transform: "rotate(180deg)" }} />
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

        {/* SUBJECTS VIEW */}
        {view === "subjects" && (
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px)", transition: "all 0.4s ease" }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", marginBottom: 10 }}>Academic Year 2025–26</div>
              <h1 style={{ fontSize: 36, fontWeight: 400, color: "#1A1A1A", margin: "0 0 10px", lineHeight: 1.2, fontFamily: FONT }}>
                Class XI Learning Portal
              </h1>
              <p style={{ fontSize: 15, color: "#666", margin: 0, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
                Select a subject to explore chapters and video lessons.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {Object.entries(data).map(([subject, info]) => (
                <div
                  key={subject}
                  onClick={() => { setSelectedSubject(subject); setView("chapters"); }}
                  onMouseEnter={() => setHoveredSubject(subject)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  style={{
                    background: hoveredSubject === subject ? info.bg : "#FFFFFF",
                    border: `1.5px solid ${hoveredSubject === subject ? info.accent + "55" : "#E5E5E0"}`,
                    borderRadius: 12,
                    padding: "24px 20px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: hoveredSubject === subject ? "translateY(-8px) scale(1.02)" : "none",
                    boxShadow: hoveredSubject === subject ? `0 20px 40px ${info.accent}15` : "0 2px 8px rgba(0,0,0,0.02)",
                    animation: `slideUp 0.6s ease forwards ${0.1 * Object.keys(data).indexOf(subject)}s`,
                    opacity: 0,
                  }}
                >
                  <style>{`
                    @keyframes slideUp {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  <div style={{ width: 48, height: 48, marginBottom: 14, borderRadius: 10, overflow: 'hidden' }}>
                    {info.icon.startsWith('/') ? (
                      <img src={info.icon} alt={subject} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: 32 }}>{info.icon}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 400, color: "#1A1A1A", marginBottom: 4, fontFamily: FONT }}>{subject}</div>
                  <div style={{ fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", color: info.accent, marginBottom: 10 }}>{info.tag}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888", fontFamily: "'Helvetica Neue', sans-serif" }}>
                    <span>{Object.keys(info.chapters).length} chapters</span>
                    <span style={{ color: "#DDD" }}>·</span>
                    <span>{totalVideos(subject)} videos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAPTERS VIEW */}
        {view === "chapters" && selectedSubject && (
          <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease" }}>
            {/* Subject header */}
            <div style={{
              background: "#FFFFFF",
              border: `1px solid #E5E5E0`,
              borderRadius: 14,
              padding: "28px 28px 24px",
              marginBottom: 28,
              borderLeft: `4px solid ${accent}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden' }}>
                  {subjectInfo.icon.startsWith('/') ? (
                    <img src={subjectInfo.icon} alt={selectedSubject} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 36 }}>{subjectInfo.icon}</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", marginBottom: 4 }}>{subjectInfo.tag}</div>
                  <h2 style={{ fontSize: 26, fontWeight: 400, color: "#1A1A1A", margin: 0, fontFamily: FONT }}>{selectedSubject}</h2>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#666", fontFamily: "'Helvetica Neue', sans-serif" }}>
                <span><strong style={{ color: "#1A1A1A" }}>{Object.keys(subjectInfo.chapters).length}</strong> chapters</span>
                <span><strong style={{ color: "#1A1A1A" }}>{totalVideos(selectedSubject)}</strong> video lessons</span>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#AAA" }}>⌕</span>
              <input
                type="text"
                placeholder="Search chapters…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 16px 11px 38px",
                  background: "#FFF",
                  border: "1px solid #E5E5E0",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "'Helvetica Neue', sans-serif",
                  color: "#1A1A1A",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Chapter list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                      gap: 14,
                      background: hoveredChapter === chapter ? subjectInfo.bg : "#FFFFFF",
                      border: `1px solid ${hoveredChapter === chapter ? accent + "44" : "#E5E5E0"}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      transform: hoveredChapter === chapter ? "translateX(4px)" : "none",
                      animation: `fadeInRight 0.4s ease forwards ${i * 0.05}s`,
                      opacity: 0,
                    }}
                  >
                    <style>{`
                      @keyframes fadeInRight {
                        from { opacity: 0; transform: translateX(-10px); }
                        to { opacity: 1; transform: translateX(0); }
                      }
                    `}</style>
                    <span style={{
                      minWidth: 32, height: 32, borderRadius: "50%",
                      background: accent + "15",
                      color: accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600,
                      fontFamily: MONO,
                    }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 14, color: "#1A1A1A", fontFamily: "'Helvetica Neue', sans-serif" }}>{chapter}</span>
                    <span style={{ fontSize: 12, color: "#AAA", fontFamily: MONO, marginRight: 4 }}>{count} vid{count !== 1 ? "s" : ""}</span>
                    <span style={{ fontSize: 16, color: "#CCC" }}>›</span>
                  </div>
                );
              })}
              {filteredChapters.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#AAA", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 14 }}>No chapters match your search.</div>
              )}
            </div>
          </div>
        )}

        {/* SUBTOPICS VIEW */}
        {view === "subtopics" && selectedSubject && selectedChapter && (
          <div>
            <button
              onClick={goSubject}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: accent, fontFamily: "'Helvetica Neue', sans-serif", padding: "0 0 24px", marginLeft: -4 }}
            >
              ← Back to {selectedSubject}
            </button>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>{selectedSubject}</div>
              <h2 style={{ fontSize: 24, fontWeight: 400, color: "#1A1A1A", margin: "0 0 6px", fontFamily: FONT }}>{selectedChapter}</h2>
              <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: "'Helvetica Neue', sans-serif" }}>
                {subjectInfo.chapters[selectedChapter].subtopics.length} video lessons in this chapter
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {subjectInfo.chapters[selectedChapter].subtopics.map((sub, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedSubtopic(sub); setView("video"); }}
                  onMouseEnter={() => setHoveredSub(i)}
                  onMouseLeave={() => setHoveredSub(null)}
                  style={{
                    background: hoveredSub === i ? subjectInfo.bg : "#FFFFFF",
                    border: `1px solid ${hoveredSub === i ? accent + "55" : "#E5E5E0"}`,
                    borderRadius: 10,
                    padding: "16px 18px",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    transform: hoveredSub === i ? "translateY(-4px) scale(1.02)" : "none",
                    boxShadow: hoveredSub === i ? `0 12px 24px ${accent}14` : "none",
                    animation: `popIn 0.4s ease forwards ${i * 0.03}s`,
                    opacity: 0,
                  }}
                >
                  <style>{`
                    @keyframes popIn {
                      from { opacity: 0; transform: scale(0.95); }
                      to { opacity: 1; transform: scale(1); }
                    }
                  `}</style>
                  <div style={{
                    minWidth: 36, height: 36, borderRadius: "50%",
                    background: accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFF", fontSize: 13, marginTop: 1, flexShrink: 0,
                  }}>▶</div>
                  <div>
                    <div style={{ fontSize: 11, color: "#AAA", fontFamily: MONO, marginBottom: 3 }}>Lesson {i + 1}</div>
                    <div style={{ fontSize: 14, color: "#1A1A1A", fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.4 }}>{sub.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO VIEW */}
        {view === "video" && selectedSubtopic && (
          <div>
            <button
              onClick={goChapter}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: accent, fontFamily: "'Helvetica Neue', sans-serif", padding: "0 0 24px", marginLeft: -4 }}
            >
              ← Back to lessons
            </button>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E0", borderRadius: 14, overflow: "hidden" }}>
              {/* Video embed */}
              <div style={{ background: "#0F0F0F", aspectRatio: "16/9", position: "relative" }}>
                <iframe
                  src={getYoutubeEmbedUrl(selectedSubtopic.video)}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  allowFullScreen
                  title={selectedSubtopic.name}
                />
              </div>

              {/* Video info */}
              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{
                    background: accent + "15",
                    color: accent,
                    fontSize: 11,
                    fontFamily: "'Helvetica Neue', sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    borderRadius: 5,
                    fontWeight: 600,
                  }}>{selectedSubject}</span>
                  <span style={{ color: "#DDD" }}>·</span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "'Helvetica Neue', sans-serif" }}>{selectedChapter}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 400, color: "#1A1A1A", margin: "0 0 10px", fontFamily: FONT }}>{selectedSubtopic.name}</h3>
                <p style={{ fontSize: 14, color: "#666", margin: 0, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.7 }}>
                  This lesson covers <em>{selectedSubtopic.name}</em> as part of the {selectedChapter} chapter. Watch the full video and revisit it anytime from the chapter page.
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
                  <div style={{ borderTop: "1px solid #F0F0EC", padding: "16px 28px", display: "flex", gap: 12 }}>
                    {prev && (
                      <button
                        onClick={() => { setSelectedSubtopic(prev); }}
                        style={{
                          flex: 1, background: "#F8F8F5", border: "1px solid #E5E5E0", borderRadius: 8,
                          padding: "10px 14px", cursor: "pointer", textAlign: "left",
                          fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif", color: "#555",
                        }}
                      >
                        <div style={{ color: "#AAA", marginBottom: 2 }}>← Previous</div>
                        <div style={{ color: "#1A1A1A" }}>{prev.name}</div>
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => { setSelectedSubtopic(next); }}
                        style={{
                          flex: 1, background: accent + "10", border: `1px solid ${accent}33`, borderRadius: 8,
                          padding: "10px 14px", cursor: "pointer", textAlign: "right",
                          fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif", color: "#555",
                        }}
                      >
                        <div style={{ color: "#AAA", marginBottom: 2 }}>Next →</div>
                        <div style={{ color: "#1A1A1A" }}>{next.name}</div>
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
      <div style={{ textAlign: "center", padding: "32px 24px", fontSize: 12, color: "#BBB", fontFamily: "'Helvetica Neue', sans-serif", borderTop: "1px solid #EFEFEB", marginTop: 40 }}>
        Class XI Learning Portal · Physics · Chemistry · Biology · Maths
      </div>
    </div>
  );
}