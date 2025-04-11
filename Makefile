back:
	cd server && pnpm dev

front:
	cd frontend && pnpm dev

app:
	make back & make front
