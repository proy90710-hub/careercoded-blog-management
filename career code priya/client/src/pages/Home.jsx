import { ArrowRight, BookOpenCheck, Compass, Sparkles } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <section className="home">
    <div className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Issue 02 · CareerCoded Learning Journal</span>
        <h1>Curated tech notes, career playbooks, and student stories.</h1>
        <p>
          A second version of the CareerCoded publishing system with an editorial journal feel.
          Admins manage articles while learners browse practical guidance, save attention with
          filters, and like the resources they value.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/blogs">
            Read Journal
            <ArrowRight size={18} />
          </Link>
          <Link className="secondary-btn" to="/admin/login">
            Editor Login
          </Link>
        </div>
      </div>
      <div className="issue-cover" aria-label="CareerCoded Journal cover">
        <span>Field Notes</span>
        <strong>Build. Write. Ship.</strong>
        <small>Portfolio thinking for modern learners</small>
      </div>
      <div className="hero-panel">
        <div>
          <BookOpenCheck />
          <strong>Editorial workflow</strong>
          <span>Create, revise, publish, and archive learning articles</span>
        </div>
        <div>
          <Compass />
          <strong>Guided discovery</strong>
          <span>Search by topic, category, and learning intent</span>
        </div>
        <div>
          <Sparkles />
          <strong>Reader signals</strong>
          <span>Users can like useful posts from their account</span>
        </div>
      </div>
      <div className="journal-strip">
        <span>Interview Prep</span>
        <span>Project Stories</span>
        <span>Developer Habits</span>
        <span>Portfolio Reviews</span>
      </div>
    </div>
  </section>
);

export default Home;
