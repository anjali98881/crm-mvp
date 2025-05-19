
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import LeadTable from "@/components/LeadTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Lead Management" 
        actionButton={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <span className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Add New Lead
            </span>
          </Button>
        } 
      />
      <main className="container mx-auto px-4 py-6">
        <LeadTable />
      </main>
    </div>
  );
};

// Import the Plus icon from lucide-react
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default Index;
