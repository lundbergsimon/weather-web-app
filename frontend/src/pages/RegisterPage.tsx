export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="flex flex-col gap-4 justify-center w-90">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="flex flex-col gap-2">
          <button type="submit" className="mt-4">Register</button>
        </div>
      </form>
    </div>
  );
}
