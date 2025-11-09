const express = require("express");
const Stripe = require("stripe");
const supabase = require("../utils/supabaseClient");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/create-checkout-session/:courseId", authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.userId;

    // Fetch user email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Supabase error fetching user:", userError);
      return res.status(500).json({ message: "Database error fetching user" });
    }

    if (!user || !user.email) {
      console.warn("User email not found for id:", userId);
      return res.status(400).json({ message: "User email not found" });
    }

    const customerEmail = user.email;

    // Fetch course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      console.error("Supabase course fetch error:", courseError);
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("🔥 COURSE DATA:", course);
    console.log("🔥 Customer email:", customerEmail);

    // Validate price
    let price = parseFloat(course.price);
    if (isNaN(price) || price <= 0) {
      console.warn("Invalid course price, using test price 100 INR");
      price = 100; // Temporary test value (1 INR = 100 paise)
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: course.title },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${course.id}`,
      cancel_url: `${FRONTEND_URL}/courses/${course.id}`,
      customer_email: customerEmail,
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("Payment session error:", err);
    res.status(500).json({ message: "Payment session error", error: err.message });
  }
});

module.exports = router;
