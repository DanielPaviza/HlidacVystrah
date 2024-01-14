using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hlidacVystrah.Migrations
{
    /// <inheritdoc />
    public partial class userlogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    password_reset_token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    password_reset_token_expire = table.Column<DateTime>(type: "datetime2", nullable: true),
                    activation_token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    login_token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    login_token_expire = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
