const checkAuthSession = async () => {
  console.log("Checking auth session...");

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    console.log("No active session, redirecting...");
    window.location.href = "login.html";
    return;
  }

  console.log("User is logged in");
};

checkAuthSession();