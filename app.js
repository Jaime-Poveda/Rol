//import { createClient } from "@supabase/supabase-js";
const { createClient } = supabase;

const supabaseUrl = "https://afribcvcanlurbnjrioe.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

//const supabase = createClient(supabaseUrl, supabaseKey);
const _supabase = createClient(supabaseUrl, supabaseKey);
//console.log("Supabase Instance: ", _supabase);

//Registro
/* console.log(
  await _supabase.auth.signUp({
    email: "example@email.com",
    password: "example-password",
  })
); */

//Login
console.log("Login:");
console.log(
  await _supabase.auth.signInWithPassword({
    email: "example@email.com",
    password: "example-password",
  })
);

console.log("Session:");
console.log(await _supabase.auth.getSession());
console.log("User:");
console.log(await _supabase.auth.getUser());

/* const { data, error } = await _supabase.auth.getSession()
console.log(data); */
