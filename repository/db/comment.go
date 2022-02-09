package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/niwa-s/go-react/models"
	"github.com/niwa-s/go-react/repository"
)

func adaptRepositoryComment(c *models.Comment) *repository.Comment {
	comment := &repository.Comment{
		ID:        int64(c.ID),
		ArticleID: int64(c.ArticleID),
		Author:    c.Author,
		Content:   c.Content.String,
		CreatedAt: c.CreatedAt,
	}
	return comment
}

func (repo Repository) GetComments(ctx context.Context, articleId int64) ([]repository.Comment, error) {
	const sqlstr = `SELECT ` + 
		`id, article_id, author, content, created_at ` +
		`FROM public.comments ` +
		`WHERE article_id = $1`
	commentsDTO := []models.Comment{}
	err := repo.Db.Select(&commentsDTO, sqlstr, articleId)
	if err != nil {
		return []repository.Comment{}, err
	}
	comments := []repository.Comment{}
	for _, comment := range commentsDTO {
		comments = append(comments, *adaptRepositoryComment(&comment))
	}
	return comments, nil
}
func (repo Repository) SaveComment(ctx context.Context, articleID int64, author string, content string, createdAt time.Time) (repository.Comment, error) {
	commentDTO := models.Comment{
		ArticleID: int(articleID),
		Author:    author,
		Content:   sql.NullString{
			String: content,
			Valid: true,
		},
		CreatedAt: createdAt,
	}
	err := commentDTO.Save(ctx, repo.Db)
	if err != nil {
		return repository.Comment{}, err
	}
	comment := adaptRepositoryComment(&commentDTO)
	return *comment, nil
}