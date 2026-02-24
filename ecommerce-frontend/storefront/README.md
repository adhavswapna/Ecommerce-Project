Ecommerce-project/
└── ecommerce-frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── search/page.tsx
    │   ├── product/[slug]/page.tsx
    │   ├── cart/page.tsx
    │   ├── checkout/page.tsx
    │   ├── orders/page.tsx
    │   ├── orders/[orderId]/page.tsx
    │   ├── profile/page.tsx
    │   └── profile/addresses/page.tsx
    │
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── ProductCard.tsx
    │   ├── CartDrawer.tsx
    │   ├── RatingStars.tsx
    │   └── SkeletonLoader.tsx
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useCart.ts
    │   ├── useProduct.ts
    │   └── useOrder.ts
    │
    ├── store/
    │   └── cartStore.ts
    │
    ├── services/
    │   ├── auth.api.ts
    │   ├── product.api.ts
    │   ├── cart.api.ts
    │   ├── order.api.ts
    │   ├── payment.api.ts
    │   ├── invoice.api.ts
    │   ├── search.api.ts
    │   └── rating.api.ts
    │
    ├── utils/
    │   ├── fetcher.ts
    │   ├── formatPrice.ts
    │   └── date.ts
    │
    ├── types/
    │   ├── index.ts
    │   ├── product.ts
    │   ├── cart.ts
    │   ├── order.ts
    │   └── user.ts
    │
    ├── middleware.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── package.json
    └── .env

