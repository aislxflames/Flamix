import ContainerCard from "@/components/cards/ContainerCard";

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const res = await fetch(`http://localhost:5000/api/v1/project/${slug}`, {
    cache: "no-store",
  });

  const project = await res.json();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Project: {slug}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.containers?.map((c: any) => (
          <ContainerCard
            key={c._id}
            projectName={slug}
            name={c.name}
            image={c.image}
            env={c.env || {}} // ENV FIX
            status={c.status?.toLowerCase()}
            domains={c.domains || []} // DOMAINS FIX
          />
        ))}
      </div>
    </div>
  );
}
