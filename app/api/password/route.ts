export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password === process.env.PASSWORD_PROTECTION) {
    return Response.json(
      { success: true, message: "Password accepted" },
      { status: 200 }
    );
  } else {
    return Response.json(
      {
        success: false,
        message: "Password is incorrect",
      },
      { status: 401 }
    );
  }
}
