import { Action, Color, Icon, List, ActionPanel } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Tag {
  name: string;
  slug: string;
}

interface Job {
  id: number;
  organization: string;
  title: string;
  location: string;
  type: string;
  url: string;
  salary?: string;
  published_at: string;
  tags: Array<Tag>;
}

export default function JobList() {
  const { data: jobs, error } = useFetch<Job[]>("https://larajobs.com/api/jobs", fetchJobsFromEndpoint);

  if (error) {
    return <List isLoading={false} searchBarPlaceholder="Failed to load jobs."></List>;
  }

  if (!jobs) {
    return <List isLoading={true} searchBarPlaceholder="Loading jobs..."></List>;
  }

  return (
    <List searchBarPlaceholder="Filter jobs by title...">
      {jobs.map((job) => (
        <List.Item
          key={job.id}
          title={job.title}
          subtitle={job.salary ?? `No salary info`}
          accessories={[
            { text: { value: job.organization }, icon: Icon.BankNote },
          ]}
          actions={
            <ActionPanel title={job.title}>
            <Action.OpenInBrowser url={job.url} />
          </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

async function fetchJobsFromEndpoint(url: string): Promise<Job[]> {
  const response = await axios.get<Job[]>(url);
  if (response.status !== 200) {
    throw new Error(`Request failed with status code ${response.status}`);
  }
  return response.data;
}