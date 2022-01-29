package mock

import (
	"context"
	"time"
	"github.com/niwa-s/go-react/repository"
)

func (repo Repository) GetAllArticles(ctx context.Context) ([]repository.Article, error) {
	mu.RLock()
	defer mu.RUnlock()

	return mockArticles, nil
}