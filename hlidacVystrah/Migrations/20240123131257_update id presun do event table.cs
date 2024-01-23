using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hlidacVystrah.Migrations
{
    /// <inheritdoc />
    public partial class updateidpresundoeventtable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "id_update",
                table: "event_locality");

            migrationBuilder.AddColumn<int>(
                name: "id_update",
                table: "event",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "id_update",
                table: "event");

            migrationBuilder.AddColumn<int>(
                name: "id_update",
                table: "event_locality",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
