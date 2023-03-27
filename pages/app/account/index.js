import Navbar from "@/components/navbar";
import EmailPasswordChange from "@/components/email-password-change";

const Index = () => {
  return (
    <>
      <Navbar name="Press Backend" isManager={true} />

      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h1 className="text-4xl">Account Settings</h1>

          <EmailPasswordChange />
        </div>
      </div>
    </>
  );
};

export default Index;
