import CapsuleCard from "../../components/capsule/CapsuleCard/CapsuleCard";
import Layout from "../../components/layout/layout";

const PublicWall = () => {
  const initialCapsules = [
    {
      id: 1,
      title: "New Year Resolutions",
      description:
        "I hope by 2026 I’ll have learned to cook properly and started that business I keep talking about!",
      location: "Beirut, Lebanon",
      revealDate: 176,
      isPublic: true,
      color: "#FFA500",
      emoji: "🎯",
      privacy: "public",
    },
    {
      id: 2,
      title: "Wedding Day Memory",
      description:
        "Just got married! I wonder what our life will look like in 5 years...",
      location: "Paris, France",
      revealDate: 1437,
      isPublic: false,
      color: "#FF1493",
      emoji: "💕",
      privacy: "private",
    },
  ];
  // const [capsules, setCapsules] = useState(initialCapsules);
  const filteredCapsules = initialCapsules.filter(
    (capsule) => capsule.isPublic
  );

  return (
    <>
      <Layout>
        <div>PublicWall</div>
        {/* CAPSULE CARDS */}
        <div style={{ marginTop: "2rem" }}>
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              onEdit={() => console.log("Edit capsule", capsule.id)}
              onDelete={() => console.log("Delete capsule", capsule.id)}
            />
          ))}
        </div>
      </Layout>
    </>
  );
};

export default PublicWall;
