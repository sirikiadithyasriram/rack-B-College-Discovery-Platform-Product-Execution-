#!/usr/bin/env ts-node
/**
 * Database setup script to add exam and rank columns to College table
 * Run with: npx ts-node setup-db.ts
 */
import { prisma } from "./src/prisma";

async function setupDatabase() {
  try {
    console.log("Setting up database schema...");

    // Add columns using raw SQL
    // SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we use try-catch
    try {
      await prisma.$executeRawUnsafe(
        'ALTER TABLE "College" ADD COLUMN "exam" TEXT NOT NULL DEFAULT "JEE"'
      );
      console.log("✓ Added exam column");
    } catch (e: any) {
      if (e.message.includes("duplicate column")) {
        console.log("✓ exam column already exists");
      } else {
        throw e;
      }
    }

    try {
      await prisma.$executeRawUnsafe(
        'ALTER TABLE "College" ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 1000'
      );
      console.log("✓ Added rank column");
    } catch (e: any) {
      if (e.message.includes("duplicate column")) {
        console.log("✓ rank column already exists");
      } else {
        throw e;
      }
    }

    // Seed data
    console.log("\nSeeding database...");
    await prisma.college.deleteMany({});

    await prisma.college.createMany({
      data: [
        {
          name: "IIT Bombay",
          location: "Mumbai",
          fees: 220000,
          rating: 4.9,
          courses: JSON.stringify(["CSE", "ECE", "Mechanical"]),
          placement: 96,
          exam: "JEE",
          rank: 150,
        },
        {
          name: "IIT Delhi",
          location: "Delhi",
          fees: 215000,
          rating: 4.8,
          courses: JSON.stringify(["CSE", "Electrical", "Aerospace"]),
          placement: 95,
          exam: "JEE",
          rank: 200,
        },
        {
          name: "IIT Madras",
          location: "Chennai",
          fees: 210000,
          rating: 4.8,
          courses: JSON.stringify(["CSE", "Aerospace", "Civil"]),
          placement: 95,
          exam: "JEE",
          rank: 250,
        },
        {
          name: "IIT Kharagpur",
          location: "Kharagpur",
          fees: 190000,
          rating: 4.7,
          courses: JSON.stringify(["CSE", "Metallurgy", "Chemical"]),
          placement: 93,
          exam: "JEE",
          rank: 350,
        },
        {
          name: "IIT Kanpur",
          location: "Kanpur",
          fees: 205000,
          rating: 4.7,
          courses: JSON.stringify(["CSE", "Maths", "Chemical"]),
          placement: 94,
          exam: "JEE",
          rank: 300,
        },
        {
          name: "IIT Roorkee",
          location: "Roorkee",
          fees: 180000,
          rating: 4.6,
          courses: JSON.stringify(["Civil", "CSE", "Electrical"]),
          placement: 92,
          exam: "JEE",
          rank: 400,
        },
        {
          name: "NIT Trichy",
          location: "Trichy",
          fees: 150000,
          rating: 4.5,
          courses: JSON.stringify(["CSE", "Civil", "Mechanical"]),
          placement: 91,
          exam: "JEE",
          rank: 700,
        },
        {
          name: "NIT Surathkal",
          location: "Mangalore",
          fees: 145000,
          rating: 4.4,
          courses: JSON.stringify(["CSE", "Electronics", "BioTech"]),
          placement: 90,
          exam: "JEE",
          rank: 850,
        },
        {
          name: "NIT Warangal",
          location: "Warangal",
          fees: 148000,
          rating: 4.4,
          courses: JSON.stringify(["CSE", "EEE", "IT"]),
          placement: 90,
          exam: "JEE",
          rank: 900,
        },
        {
          name: "NIT Calicut",
          location: "Calicut",
          fees: 142000,
          rating: 4.3,
          courses: JSON.stringify(["CSE", "Chemical", "Civil"]),
          placement: 88,
          exam: "JEE",
          rank: 1000,
        },
        {
          name: "IIIT Hyderabad",
          location: "Hyderabad",
          fees: 200000,
          rating: 4.7,
          courses: JSON.stringify(["CSE", "Data Science", "AI"]),
          placement: 94,
          exam: "JEE",
          rank: 500,
        },
        {
          name: "IIIT Bangalore",
          location: "Bangalore",
          fees: 195000,
          rating: 4.6,
          courses: JSON.stringify(["CSE", "Design", "Data"]),
          placement: 93,
          exam: "JEE",
          rank: 550,
        },
        {
          name: "BITS Pilani",
          location: "Pilani",
          fees: 250000,
          rating: 4.6,
          courses: JSON.stringify(["CSE", "ECE", "Physics"]),
          placement: 92,
          exam: "BITSAT",
          rank: 5000,
        },
        {
          name: "BITS Goa",
          location: "Goa",
          fees: 245000,
          rating: 4.5,
          courses: JSON.stringify(["CSE", "Chemical", "Economics"]),
          placement: 90,
          exam: "BITSAT",
          rank: 6000,
        },
        {
          name: "VIT Vellore",
          location: "Vellore",
          fees: 180000,
          rating: 4.3,
          courses: JSON.stringify(["CSE", "IT", "Mechanical"]),
          placement: 87,
          exam: "VITEEE",
          rank: 8000,
        },
        {
          name: "VIT Chennai",
          location: "Chennai",
          fees: 175000,
          rating: 4.2,
          courses: JSON.stringify(["CSE", "ECE", "Civil"]),
          placement: 86,
          exam: "VITEEE",
          rank: 10000,
        },
        {
          name: "SRM Chennai",
          location: "Chennai",
          fees: 170000,
          rating: 4.1,
          courses: JSON.stringify(["CSE", "Biomedical", "Aerospace"]),
          placement: 84,
          exam: "SRMJEEE",
          rank: 15000,
        },
        {
          name: "Manipal Institute of Technology",
          location: "Manipal",
          fees: 165000,
          rating: 4.0,
          courses: JSON.stringify(["CSE", "AI", "Civil"]),
          placement: 85,
          exam: "MET",
          rank: 12000,
        },
        {
          name: "Jadavpur University",
          location: "Kolkata",
          fees: 90000,
          rating: 4.2,
          courses: JSON.stringify(["CSE", "ECE", "Architecture"]),
          placement: 88,
          exam: "WBJEE",
          rank: 500,
        },
        {
          name: "Anna University",
          location: "Chennai",
          fees: 95000,
          rating: 4.1,
          courses: JSON.stringify(["CSE", "Civil", "EEE"]),
          placement: 86,
          exam: "TNEA",
          rank: 1200,
        },
        {
          name: "Delhi University",
          location: "Delhi",
          fees: 60000,
          rating: 4.0,
          courses: JSON.stringify(["B.Com", "B.A.", "B.Sc."]),
          placement: 70,
          exam: "CUET",
          rank: 50000,
        },
        {
          name: "Jamia Millia Islamia",
          location: "Delhi",
          fees: 65000,
          rating: 4.0,
          courses: JSON.stringify(["CSE", "Law", "Mass Communication"]),
          placement: 75,
          exam: "CUET",
          rank: 45000,
        },
        {
          name: "Thapar Institute of Engineering",
          location: "Patiala",
          fees: 155000,
          rating: 4.2,
          courses: JSON.stringify(["CSE", "EEE", "Civil"]),
          placement: 89,
          exam: "JEE",
          rank: 1200,
        },
        {
          name: "Amity University Noida",
          location: "Noida",
          fees: 175000,
          rating: 3.9,
          courses: JSON.stringify(["CSE", "Management", "Media"]),
          placement: 80,
          exam: "AMUEEE",
          rank: 20000,
        },
        {
          name: "PES University",
          location: "Bangalore",
          fees: 160000,
          rating: 4.1,
          courses: JSON.stringify(["CSE", "Mechanical", "Design"]),
          placement: 86,
          exam: "PESSAT",
          rank: 18000,
        },
      ],
    });

    console.log("✓ Database seeded successfully");
    console.log("\n✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
