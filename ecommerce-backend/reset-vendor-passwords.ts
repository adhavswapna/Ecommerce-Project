import prisma from "./src/db/prisma/prisma";
import { hashPassword } from "./src/utils/password";

async function main() {
  const vendors = [
    {
      email: "swapnaadhav123@gmail.com",
      password: "SwapnaVendor@123",
    },
    {
      email: "swapnaadhav@rediffmail.com",
      password: "SwapnaVendor@456",
    },
    {
      email: "testvendor@example.com",
      password: "VendorPassword123",
    },
  ];

  for (const vendor of vendors) {
    const hashedPassword = await hashPassword(vendor.password);

    const result = await prisma.authUser.update({
      where: {
        email: vendor.email,
      },
      data: {
        password: hashedPassword,
        isVerified: true,
      },
    });

    console.log(`Password updated: ${result.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
