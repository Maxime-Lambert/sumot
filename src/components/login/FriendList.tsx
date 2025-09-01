import type { FriendRequest } from "@/api/friendRequests/getFriendRequests/GetFriendRequests";

type FriendListProps = {
  title: string;
  emptyText: string;
  list: FriendRequest[];
  action: (f: FriendRequest) => React.ReactNode;
};

export default function FriendList({
  title,
  emptyText,
  list,
  action,
}: FriendListProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {list.length === 0 ? (
        <p className="text-muted">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {list.map((f) => (
            <li
              key={f.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-border rounded p-3"
            >
              <div className="text-sm">
                <span className="font-medium">{f.userName}</span>{" "}
                <span className="text-muted">({f.email})</span>
              </div>
              {action(f)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
