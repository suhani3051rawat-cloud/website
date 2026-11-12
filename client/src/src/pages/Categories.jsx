import React from 'react';
import { Link } from 'react-router-dom';
import milk from '../assets/milk.jpg';
import paneer from '../assets/paneer3.jfif';
import curd from '../assets/curd.jfif';
import vermicelli from '../assets/vermicelli.jfif';
import bread from '../assets/bread.jfif';
import peanut from '../assets/peanut.jfif';
import poha from '../assets/poha.jfif';
import bar from '../assets/bars.jfif';
import egg from '../assets/egg2.jfif';
import oats from '../assets/oats.jfif';
import '../components/AppRoute.css';

const categories = [
  { name: 'Milk Products', image: milk, path: '/MilkProducts', description: 'Freshness in every drop' },
  { name: 'Paneer & Tofu', image: paneer, path: '/PaneerAndTofu', description: 'Protein-packed goodness' },
  { name: 'Peanut Butter', image: peanut, path: '/PeanutButter', description: 'A healthy everyday spread' },
  { name: 'Curd', image: curd, path: '/Curd', description: 'Creamy and naturally fresh' },
  { name: 'Bread', image: bread, path: '/Bread', description: 'Freshly baked favourites' },
  { name: 'Vermicelli', image: vermicelli, path: '/Vermicelli', description: 'Perfect for every recipe' },
  { name: 'Healthy Bars', image: bar, path: '/bar', description: 'Smart snacking made easy' },
  { name: 'Poha', image: poha, path: '/poha', description: 'A wholesome breakfast choice' },
  { name: 'Oats', image: oats, path: '/oats', description: 'Start your day healthy' },
  { name: 'Eggs', image: egg, path: '/egg', description: 'Simple nutrition, every day' }
];

function Categories() {
  return (
    <div className="categories-page">

      <section className="category-hero">
        <div className="category-hero-content">
          <span className="category-tag">FRESHNESS YOU CAN TRUST</span>

          <h1>
            Good Food. <span>Good Life.</span>
          </h1>

          <p>
            Explore our carefully selected range of fresh and healthy
            everyday essentials.
          </p>

          <div className="category-hero-bottom">
            <span>Fresh choices for a healthier lifestyle</span>
            <span className="hero-leaf">✦</span>
          </div>
        </div>

        <div className="hero-decoration hero-decoration-one"></div>
        <div className="hero-decoration hero-decoration-two"></div>
      </section>

      <section className="category-section">

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              to={category.path}
              className="category-card"
              key={category.name}
            >
              <div className="category-image-wrapper">
                <img src={category.image} alt={category.name} />
              </div>

              <div className="category-card-content">
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <span className="explore-text">Explore <span>→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Categories;