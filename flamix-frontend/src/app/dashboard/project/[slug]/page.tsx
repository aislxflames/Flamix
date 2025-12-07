import ContainerCard from "@/components/cards/ContainerCard";
import CreateContainerDialog from "@/components/container/CreateContainerDialog";

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const res = await fetch(`http://localhost:5000/api/v1/project/${slug}`, {
    cache: "no-store",
  });

  const project = await res.json();
  const hrefUrl = `/dashboard/project/${project.projectName}/`;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Project: {slug}</h1>
        <CreateContainerDialog name={slug} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.containers?.map((c: any) => (
          <ContainerCard
            key={c._id}
            projectName={slug}
            containerName={c.name}
            image={c.image}
            href={`${hrefUrl}/${c.name}`}
            env={c.env || {}} // ENV FIX
            status={c.status?.toLowerCase()}
            domains={c.domains || []} // DOMAINS FIX
          />
        ))}
      </div>
    </div>
  );
}
