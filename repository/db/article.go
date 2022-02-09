package db

import (
	"context"
	"database/sql"
	"log"
	"time"

	"github.com/niwa-s/go-react/models"
	"github.com/niwa-s/go-react/repository"
)

func AdaptRepositoryArticle(a *models.Article) *repository.Article {
	article := &repository.Article{
		ID:        int64(a.ID),
		Title:     a.Title,
		Content:   a.Content.String,
		CreatedAt: a.CreatedAt,
		Author:    a.Author,
	}
	return article
}

func (repo Repository) GetAllArticles(ctx context.Context) ([]repository.Article, error) {
	articles := []repository.Article{}
	rows, err := repo.Db.Query("select id, title, content, created_at, author from articles");
	if err != nil {
		log.Fatalln(err)
	}
	for rows.Next() {
		var id int64
		var title string
		var content sql.NullString
		var createdAt time.Time
		var author string
		err = rows.Scan(&id, &title, &content, &createdAt, &author)
		if err != nil {
			log.Fatalln(err)
		}
		articles = append(articles, repository.Article{
			ID:        id,
			Title:     title,
			Content:   content.String,
			CreatedAt: createdAt,
			Author:    author,
		})
	}
	err = rows.Err()
	if err != nil {
		log.Fatalln(err)
	}
	return articles, nil
}
func (repo Repository) GetAllArticle(ctx context.Context, id int64) (repository.Article, error) {
	a, err := models.ArticleByID(ctx, repo.Db, int(id));
	article := AdaptRepositoryArticle(a)
	if err != nil {
		log.Fatalln(err)
	}
	return *article, err
}

func (repo Repository) SaveArticles(ctx context.Context, title, content, author string, createdAt time.Time) (repository.Article, error) {
	a := &models.Article{
		Title:     title,
		Content:   sql.NullString{
			String: content,
			Valid: true,
		},
		CreatedAt: createdAt,
		Author:    author,
	}
	err := a.Save(ctx, repo.Db)
	if err != nil {
		return repository.Article{}, err
	}
	article := AdaptRepositoryArticle(a)
	return *article, nil
}