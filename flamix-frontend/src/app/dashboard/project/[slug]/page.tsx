import ContainerCard from "@/components/cards/ContainerCard";
import CreateContainerDialog from "@/components/container/CreateContainerDialog";
import { getProject } from "@/utils/project";

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const project = await getProject(slug);
  const hrefUrl = `/dashboard/project/${project.projectName}/`;
  const projectName = String(slug);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Project: {slug}</h1>
        <CreateContainerDialog projectName={projectName} />
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
