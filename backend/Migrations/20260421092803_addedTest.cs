using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quiz_test.Migrations
{
    /// <inheritdoc />
    public partial class addedTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TestId",
                table: "Questions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    TestName = table.Column<string>(type: "text", nullable: false),
                    TimeLimit = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_TestId",
                table: "Questions",
                column: "TestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Tests_TestId",
                table: "Questions",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Tests_TestId",
                table: "Questions");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropIndex(
                name: "IX_Questions_TestId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "Questions");
        }
    }
}
